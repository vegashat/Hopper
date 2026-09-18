using Hopper.Api.Models;
using Hopper.Api.Repositories;
using Hopper.Api.RealTime;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Hopper.Api.Services;

public class DraftEngine
{
    private readonly IParticipantRepository _participants;
    private readonly ISelectionRepository _selections;
    private readonly IDraftRepository _drafts;
    private readonly ILogger<DraftEngine> _logger;
    private readonly IHubContext<DraftHub> _hub;
    private static readonly ConcurrentDictionary<int, SemaphoreSlim> _seasonLocks = new();

    private SemaphoreSlim GetSeasonLock(int seasonId) =>
        _seasonLocks.GetOrAdd(seasonId, _ => new SemaphoreSlim(1, 1));

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

    public async Task<DraftStatus> UpdateAllotmentAsync(int seasonId, string firebaseUserId, int allotment)
    {
        var seasonLock = GetSeasonLock(seasonId);
        await seasonLock.WaitAsync();
        try
        {
            await _participants.UpdateAllotmentAsync(seasonId, firebaseUserId, allotment);
            var draft = await _drafts.GetActiveDraftAsync(seasonId);
            if (draft != null) await ReplenishQueueAsync(seasonId, draft);
            var status = await BuildStatusAsync(seasonId);
            await _hub.Clients.Group(Group(seasonId)).SendAsync("StatusChanged", status);
            return status;
        }
        finally { seasonLock.Release(); }
    }

    public async Task<Draft> StartDraftAsync(int seasonId)
    {
        var seasonLock = GetSeasonLock(seasonId);
        await seasonLock.WaitAsync();
        try
        {
            var draft = await _drafts.StartDraftAsync(seasonId);

            var picks = await GenerateWeightedPicksAsync(draft.DraftId, seasonId, startOrder: 1, count: 3);
            if (picks.Any())
                await _drafts.AddDraftPicksAsync(picks);

            await BroadcastStatus(seasonId, "DraftStarted");
            return draft;
        }
        finally
        {
            seasonLock.Release();
        }
    }

    public async Task ResetDraftAsync(int seasonId)
    {
        await _drafts.ResetDraftAsync(seasonId);
        await BroadcastStatus(seasonId, "DraftReset");
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


    public async Task<bool> ReplenishQueueAfterSelectionAsync(int seasonId)
    {
        var seasonLock = GetSeasonLock(seasonId);
        await seasonLock.WaitAsync();
        try
        {
            var draft = await _drafts.GetActiveDraftAsync(seasonId);
            if (draft is null) return false;

            await ReplenishQueueAsync(seasonId, draft);
            await BroadcastStatus(seasonId, "PickClaimed");
            return true;
        }
        finally
        {
            seasonLock.Release();
        }
    }

    public async Task<bool> SkipNextPickAsync(int seasonId)
    {
        var seasonLock = GetSeasonLock(seasonId);
        await seasonLock.WaitAsync();
        try
        {
            var skipped = await _drafts.SkipNextPickAsync(seasonId);
            if (!skipped) return false;
            var draft = await _drafts.GetActiveDraftAsync(seasonId);
            if (draft is not null) await ReplenishQueueAsync(seasonId, draft);
            await BroadcastStatus(seasonId, "PickSkipped");
            return true;
        }
        finally { seasonLock.Release(); }
    }

    private async Task ReplenishQueueAsync(int seasonId, Draft draft)
    {
        await _drafts.RemoveUnusablePicksAsync(draft.DraftId, seasonId);
        var upcoming = (await _drafts.GetUpcomingPicksAsync(draft.DraftId, 3)).ToList();
        if (upcoming.Count >= 3 || !await _selections.AnyTicketsRemainingAsync(seasonId)) return;

        var start = await _drafts.GetLastPickOrderAsync(draft.DraftId) + 1;
        var next = await GenerateWeightedPicksAsync(draft.DraftId, seasonId, start, 1);
        foreach (var pick in next) await _drafts.AddDraftPickAsync(pick);
    }

    public async Task<DraftStatus> BuildStatusAsync(int seasonId)
    {
        var draft = await _drafts.GetActiveDraftAsync(seasonId);
        var status = new DraftStatus { SeasonId = seasonId, IsActive = draft != null };

        var participants = (await _participants.GetAllAsync()).ToDictionary(p => p.FirebaseUserId, p => p);
        var allot = (await _participants.GetAllotmentsBySeasonAsync(seasonId)).ToDictionary(a => a.FirebaseUserId, a => a.TicketAllotment);
        var pickedBy = (await _selections.GetPickedByUserAsync(seasonId)).ToDictionary(x => x.FirebaseUserId, x => x.Tickets);

        if (draft != null)
        {
            var upcoming = await _drafts.GetUpcomingPicksAsync(draft.DraftId, 3);
            status.Upcoming = upcoming.Select(u => new UpcomingPick
            {
                DraftPickId = u.DraftPickId,
                PickOrder = u.PickOrder,
                FirebaseUserId = u.FirebaseUserId,
                DisplayName = participants.TryGetValue(u.FirebaseUserId, out var p) ? p.DisplayName : null
            });

            var history = await _drafts.GetDraftPicksAsync(draft.DraftId);
            status.History = history
                .Where(h => h.ClaimedUtc.HasValue)
                .OrderBy(h => h.PickOrder)
                .Select(h => new HistoryPick
                {
                    PickOrder = h.PickOrder,
                    FirebaseUserId = h.FirebaseUserId,
                    DisplayName = participants.TryGetValue(h.FirebaseUserId, out var p) ? p.DisplayName : null,
                    ClaimedUtc = h.ClaimedUtc,
                    IsSkipped = h.GameId == 0
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

    private async Task<List<DraftPick>> GenerateWeightedPicksAsync(
        int draftId, int seasonId, int startOrder, int count)
    {
            var allotments = (await _participants.GetAllotmentsBySeasonAsync(seasonId))
                .ToDictionary(a => a.FirebaseUserId, a => a.TicketAllotment);

            var history = (await _drafts.GetDraftPicksAsync(draftId))
                .OrderBy(p => p.PickOrder)
                .ToList();

            var upcoming = (await _drafts.GetUpcomingPicksAsync(draftId))
                .OrderBy(p => p.PickOrder)
                .ToList();

            var assignedByUser = history
                .GroupBy(h => h.FirebaseUserId)
                .ToDictionary(g => g.Key, g => g.Sum(g => g.Quantity));

            var weights = new Dictionary<string, int>();
            var luck = new Dictionary<string, double>();
            foreach (var kv in allotments)
            {
                var uid = kv.Key;
                var allotment = kv.Value;
                var assigned = assignedByUser.GetValueOrDefault(uid, 0);

                var remaining = Math.Max(0, allotment - assigned);
                _logger.LogInformation("User {UserId} was alloted {allotment} tickets and has been assigned {assigned} tickets with {remainging} remaining", uid, allotment, assigned, remaining);

                luck[uid] = allotment == 0 ? 100 : assigned * 100.0 / allotment;

                //Don't put into the pool if you are already there
                if (upcoming.Any(u => u.FirebaseUserId == uid) && remaining == 2){
                    continue;
                }

                if (remaining > 0)
                    weights[uid] = remaining;
            }
            if (weights.Count == 0) return new List<DraftPick>();

            var averageLuck = luck.Values.Average();
            string? lastUid = history.LastOrDefault()?.FirebaseUserId;
            bool lastTwoSame = history.Count >= 2 &&
                               history[^1].FirebaseUserId == history[^2].FirebaseUserId;

            var missed = new Dictionary<string, int>();
            foreach (var uid in weights.Keys)
            {
                var lastPick = history.LastOrDefault(h => h.FirebaseUserId == uid);
                int gamesSince = (lastPick == null) ? history.Count : history.Count - lastPick.PickOrder;
                // _logger.LogInformation("Games since {UserId} last picked {gamesSince} games.", uid, gamesSince);

                if (!upcoming.Any(u => u.FirebaseUserId == uid))
                    missed[uid] = gamesSince;
            }

            var pool = new List<string>();
            var picks = new List<DraftPick>(count);
            foreach (var (uid, w) in weights)
            {
                if (missed.TryGetValue(uid, out var gap) && gap >= 10)
                {
                    _logger.LogInformation("Forcing {UserId} into pool with larger ticket quantity after {Gap} misses.", uid, gap);
                    if (!assignedByUser.Any(a => a.Key == uid))
                    {
                        if (gap >= 12)
                        {
                            picks.Add(new DraftPick
                            {
                                DraftId = draftId,
                                FirebaseUserId = uid,
                                PickOrder = startOrder
                            });
                            return picks;
                        }
                    }
                    else
                    {

                        switch (gap)
                        {
                            case > 15:
                                pool.AddRange(Enumerable.Repeat(uid, 1000));
                                break;
                            case > 13:
                                pool.AddRange(Enumerable.Repeat(uid, 500));
                                break;
                            default:
                                pool.AddRange(Enumerable.Repeat(uid, 100));
                                break;
                        }

                    }
                }
                else
                {
                    //Cool down the lucky streak
                    if (luck[uid] > averageLuck)
                    {
                        _logger.LogInformation("Cooling down user {user} with luck {luck}", uid, luck[uid]);
                        pool.AddRange(Enumerable.Repeat(uid, w / 2));
                    }
                    else
                    {
                        //Warm up any unlucky streak
                        if (luck[uid] < averageLuck)
                        {
                            _logger.LogInformation("Heating up user {user} with luck {luck}", uid, luck[uid]);
                            pool.AddRange(Enumerable.Repeat(uid, w * 2));
                        }
                        else
                        {
                            pool.AddRange(Enumerable.Repeat(uid, w));
                        }
                    }
                }
            }

            var rnd = Random.Shared;

            for (int i = 0; i < count && pool.Count > 0; i++)
            {
                string uid;
                while (true)
                {
                    var idx = rnd.Next(pool.Count);
                    uid = pool[idx];

                    if (lastTwoSame && uid == lastUid && weights.Count > 1)
                    {
                        _logger.LogWarning("Prevented {UserId} from 3rd consecutive pick. Re-rolling.", uid);
                        continue;
                    }
                    break;
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

                weights[uid]--;
                if (weights[uid] <= 0)
                {
                    weights.Remove(uid);
                    pool.RemoveAll(candidate => candidate == uid);
                }
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
