using Hopper.Api.Models;
using Hopper.Api.Repositories;
using Hopper.Api.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Components.Forms;

namespace Hopper.Api.Services;

public class DraftEngine
{
    private readonly IParticipantRepository _participants;
    private readonly ISelectionRepository _selections;
    private readonly IDraftRepository _drafts;
    private readonly ILogger<DraftEngine> _logger;
    private readonly IHubContext<DraftHub> _hub;

    public DraftEngine(
        IParticipantRepository participants,
        ISelectionRepository selections,
        IDraftRepository drafts,
        ILogger<DraftEngine> logger,
        IHubContext<DraftHub> hub)
    {
        _participants = participants;
        _selections = selections;
        _drafts = drafts;
        _logger = logger;
        _hub = hub;
    }

    private string Group(int seasonId) => DraftHub.SeasonGroup(seasonId.ToString());

    // --- Public API ---

    public async Task<Draft> StartDraftAsync(int seasonId)
    {
        var draft = await _drafts.StartDraftAsync(seasonId);

        var picks = await GenerateWeightedPicksAsync(draft.DraftId, seasonId, startOrder: 1, count: 3);
        if (picks.Any())
            await _drafts.AddDraftPicksAsync(picks);

        await BroadcastStatus(seasonId, "DraftStarted");
        return draft;
    }

    public async Task ResetDraftAsync(int seasonId)
    {
        await _drafts.ResetDraftAsync(seasonId);
        await _hub.Clients.Group(Group(seasonId)).SendAsync("DraftReset", new { seasonId });
        await BroadcastStatus(seasonId, "StatusChanged");
    }

    public async Task<IEnumerable<DraftPick>> GetUpcomingAsync(int seasonId, int take = 3)
    {
        var draft = await _drafts.GetActiveDraftAsync(seasonId)
            ?? throw new InvalidOperationException("No active draft for this season.");
        return await _drafts.GetUpcomingPicksAsync(draft.DraftId, take);
    }

    public async Task<IEnumerable<DraftPick>> GetHistoryAsync(int seasonId)
    {
        var draft = await _drafts.GetActiveDraftAsync(seasonId)
            ?? throw new InvalidOperationException("No active draft for this season.");
        return await _drafts.GetDraftPicksAsync(draft.DraftId);
    }

    public async Task<bool> AdvanceQueueAfterSelectionAsync(int seasonId, string firebaseUserId, int gameId )
    {
        var draft = await _drafts.GetActiveDraftAsync(seasonId);
        if (draft is null) return false;

        var claimed = await _drafts.ClaimNextPickAsync(draft.DraftId, expectedFirebaseUserId: firebaseUserId, gameId);
        if (!claimed) return false;

        var upcoming = (await _drafts.GetUpcomingPicksAsync(draft.DraftId, 3)).ToList();
        if (upcoming.Count < 3 && await _selections.AnyTicketsRemainingAsync(seasonId))
        {
            var start = await _drafts.GetLastPickOrderAsync(draft.DraftId) + 1;
            var next = await GenerateWeightedPicksAsync(draft.DraftId, seasonId, start, 1);
            foreach (var p in next) await _drafts.AddDraftPickAsync(p);
        }

        await BroadcastStatus(seasonId, "PickClaimed");
        return true;
    }

    public async Task<DraftStatus> BuildStatusAsync(int seasonId)
    {
        var draft = await _drafts.GetActiveDraftAsync(seasonId);
        var status = new DraftStatus{ SeasonId = seasonId, IsActive = draft != null };

        var participants = (await _participants.GetAllAsync()).ToDictionary(p => p.FirebaseUserId, p => p);
        var allot = (await _participants.GetAllotmentsBySeasonAsync(seasonId)).ToDictionary(a => a.FirebaseUserId, a => a.TicketAllotment);
        var pickedBy = (await _selections.GetPickedByUserAsync(seasonId)).ToDictionary(x => x.FirebaseUserId, x => x.Tickets);

        if (draft != null)
        {
            var upcoming = await _drafts.GetUpcomingPicksAsync(draft.DraftId, 3);
            status.Upcoming = upcoming.Select(u => new UpcomingPick
            {
                PickOrder = u.PickOrder,
                FirebaseUserId = u.FirebaseUserId,
                DisplayName = participants.TryGetValue(u.FirebaseUserId, out var p) ? p.DisplayName : null
            });

            var history = await _drafts.GetDraftPicksAsync(draft.DraftId);
            status.History = history
                .Where(h => h.ClaimedUtc != null)
                .OrderBy(h => h.PickOrder)
                .Select(h => new HistoryPick
                {
                    PickOrder = h.PickOrder,
                    FirebaseUserId = h.FirebaseUserId,
                    DisplayName = participants.TryGetValue(h.FirebaseUserId, out var p) ? p.DisplayName : null,
                    ClaimedUtc = h.ClaimedUtc
                });
        }

        status.Users = participants.Values.Select(p =>
        {
            var allotment = allot.GetValueOrDefault(p.FirebaseUserId, 0);
            var picked = pickedBy.GetValueOrDefault(p.FirebaseUserId, 0);
            return new UserProgress
            {
                FirebaseUserId = p.FirebaseUserId,
                DisplayName = p.DisplayName,
                Allotment = allotment,
                Picked = picked
            };
        }).OrderByDescending(u => u.Remaining);

        status.TotalTicketsRemaining = status.Users.Sum(u => u.Remaining);

        return status;
    }

    private async Task BroadcastStatus(int seasonId, string eventName)
    {
        var status = await BuildStatusAsync(seasonId);
        await _hub.Clients.Group(Group(seasonId)).SendAsync(eventName, status);
        await _hub.Clients.Group(Group(seasonId)).SendAsync("StatusChanged", status);
    }

    // --- Weighted picker with guards ---

    private async Task<List<DraftPick>> GenerateWeightedPicksAsync(
        int draftId, int seasonId, int startOrder, int count)
    {
        var participants = (await _participants.GetAllAsync()).ToDictionary(p => p.FirebaseUserId);
        var allotments = (await _participants.GetAllotmentsBySeasonAsync(seasonId))
            .ToDictionary(a => a.FirebaseUserId, a => a.TicketAllotment);

        var pickedByUser = (await _selections.GetPickedByUserAsync(seasonId))
            .ToDictionary(x => x.FirebaseUserId, x => x.Tickets);

        var weights = new Dictionary<string, int>();
        foreach (var kv in allotments)
        {
            var uid = kv.Key;
            var allotment = kv.Value;
            pickedByUser.TryGetValue(uid, out var picked);
            var remaining = Math.Max(0, allotment - picked);
            if (remaining > 0) weights[uid] = remaining;
        }
        if (weights.Count == 0) return new List<DraftPick>();

        var history = (await _drafts.GetDraftPicksAsync(draftId)).OrderBy(p => p.PickOrder).ToList();
        string? lastUid = history.LastOrDefault()?.FirebaseUserId;
        bool lastTwoSame = history.Count >= 2 &&
                           history[^1].FirebaseUserId == history[^2].FirebaseUserId;

        var missed = new Dictionary<string, int>();
        foreach (var uid in weights.Keys)
        {
            var lastPick = history.LastOrDefault(h => h.FirebaseUserId == uid);
            int gamesSince = (lastPick == null) ? history.Count : history.Count - lastPick.PickOrder;
            missed[uid] = gamesSince;
        }

        var pool = new List<string>();
        foreach (var (uid, w) in weights)
        {
            if (missed.TryGetValue(uid, out var gap) && gap >= 10)
            {
                _logger.LogInformation("Forcing {UserId} into pool after {Gap} misses.", uid, gap);
                for (int i = 0; i < 100; i++) pool.Add(uid);
            }
            else
            {
                for (int i = 0; i < w; i++) pool.Add(uid);
            }
        }

        var rnd = Random.Shared;
        var picks = new List<DraftPick>(count);

        for (int i = 0; i < count && pool.Count > 0; i++)
        {
            string uid;
            while (true)
            {
                var idx = rnd.Next(pool.Count);
                uid = pool[idx];
                if (!(lastTwoSame && uid == lastUid))
                    break;
                _logger.LogWarning("Prevented {UserId} from 3rd consecutive pick. Re-rolling.", uid);
            }

            picks.Add(new DraftPick
            {
                DraftId = draftId,
                FirebaseUserId = uid,
                PickOrder = startOrder + i
            });

            lastTwoSame = (lastUid == uid);
            lastUid = uid;
            history.Add(picks.Last());
        }

        return picks;
    }

    // --- Simulation helpers (unchanged, but still useful) ---

    public async Task<IEnumerable<SimulatedPick>> SimulateDraftAsync(int seasonId, int count = 20)
    {
        var draft = await _drafts.GetActiveDraftAsync(seasonId)
            ?? new Draft { DraftId = -1, SeasonId = seasonId, CreatedUtc = DateTime.UtcNow, IsActive = true };

        var picks = new List<SimulatedPick>();
        var simulatedPickedByUser = new Dictionary<string, int>();

        for (int i = 0; i < count; i++)
        {
            var next = await GenerateWeightedPicksSimulatedAsync(draft.DraftId, seasonId, i + 1, 1, simulatedPickedByUser);
            if (!next.Any()) break;

            var pick = next.First();
            picks.Add(pick);
            simulatedPickedByUser[pick.FirebaseUserId] = simulatedPickedByUser.GetValueOrDefault(pick.FirebaseUserId) + 1;
        }

        _logger.LogInformation("Simulation generated {Count} picks for season {SeasonId}", picks.Count, seasonId);
        return picks;
    }

    private async Task<List<SimulatedPick>> GenerateWeightedPicksSimulatedAsync(
        int draftId,
        int seasonId,
        int startOrder,
        int count,
        Dictionary<string, int> simulatedPickedByUser)
    {
        var allotments = (await _participants.GetAllotmentsBySeasonAsync(seasonId))
            .ToDictionary(a => a.FirebaseUserId, a => a.TicketAllotment);

        var dbPicked = (await _selections.GetPickedByUserAsync(seasonId))
            .ToDictionary(x => x.FirebaseUserId, x => x.Tickets);

        var pickedByUser = new Dictionary<string, int>(dbPicked);
        foreach (var kv in simulatedPickedByUser)
            pickedByUser[kv.Key] = pickedByUser.GetValueOrDefault(kv.Key) + kv.Value;

        var weights = new Dictionary<string, int>();
        foreach (var kv in allotments)
        {
            var uid = kv.Key;
            var remaining = Math.Max(0, kv.Value - pickedByUser.GetValueOrDefault(uid));
            if (remaining > 0) weights[uid] = remaining;
        }
        if (weights.Count == 0) return new List<SimulatedPick>();

        var pool = new List<(string uid, bool forced)>();
        foreach (var (uid, w) in weights)
        {
            // for simulation: if gap ≥ 10, weight heavily
            if (!simulatedPickedByUser.ContainsKey(uid) || simulatedPickedByUser[uid] == 0)
                pool.AddRange(Enumerable.Repeat((uid, true), 100));
            else
                pool.AddRange(Enumerable.Repeat((uid, false), w));
        }

        var rnd = Random.Shared;
        var picks = new List<SimulatedPick>(count);
        string? lastUid = null;
        bool lastTwoSame = false;

        for (int i = 0; i < count && pool.Count > 0; i++)
        {
            string uid;
            bool wasForced;
            while (true)
            {
                var idx = rnd.Next(pool.Count);
                (uid, wasForced) = pool[idx];
                if (!(lastTwoSame && uid == lastUid))
                    break;
            }

            picks.Add(new SimulatedPick
            {
                PickOrder = startOrder + i,
                FirebaseUserId = uid,
                WasForced = wasForced,
                WasRerolled = false
            });

            lastTwoSame = (lastUid == uid);
            lastUid = uid;
            simulatedPickedByUser[uid] = simulatedPickedByUser.GetValueOrDefault(uid) + 1;
        }

        return picks;
    }
}