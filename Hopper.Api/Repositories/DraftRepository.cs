using Dapper;
using Hopper.Api.Models;

namespace Hopper.Api.Repositories;

public interface IDraftRepository
{
    Task<Draft> StartDraftAsync(int seasonId);
    Task ResetDraftAsync(int seasonId);
    Task<Draft?> GetActiveDraftAsync(int seasonId);

    Task<IEnumerable<DraftPick>> GetDraftPicksAsync(int draftId);                    // full history
    Task<IEnumerable<DraftPick>> GetUpcomingPicksAsync(int draftId, int take = 3);   // unclaimed, in order

    Task<int> GetLastPickOrderAsync(int draftId);
    Task AddDraftPicksAsync(IEnumerable<DraftPick> picks);
    Task AddDraftPickAsync(DraftPick pick);

    /// Marks the *earliest* unclaimed pick as claimed. Optionally enforce whose turn it is.
    Task<bool> ClaimNextPickAsync(int draftId, string? expectedFirebaseUserId = null, int? gameId = null);
}

public class DraftRepository : IDraftRepository
{
    private readonly Db _db;
    public DraftRepository(Db db) => _db = db;

    public async Task<Draft> StartDraftAsync(int seasonId)
    {
        using var conn = _db.Open();
        await conn.ExecuteAsync(
            "UPDATE Draft SET IsActive = 0 WHERE SeasonId=@seasonId AND IsActive=1",
            new { seasonId });

        var id = await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO Draft (SeasonId, IsActive) VALUES (@seasonId,1);
              SELECT CAST(SCOPE_IDENTITY() as int);",
            new { seasonId });

        return new Draft
        {
            DraftId = id,
            SeasonId = seasonId,
            CreatedUtc = DateTime.UtcNow,
            IsActive = true
        };
    }

    public async Task ResetDraftAsync(int seasonId)
    {
        using var conn = _db.Open();
        await conn.ExecuteAsync(@"
            DELETE FROM Selection WHERE DraftPickId IN (Select DraftPickId from Draft WHERE SeasonId = @seasonId);
            DELETE FROM DraftPick WHERE DraftId IN (SELECT DraftId FROM Draft WHERE SeasonId=@seasonId);
            DELETE FROM Draft WHERE SeasonId=@seasonId;
            UPDATE GAME set RemainingTickets = 4 where SeasonId = @seasonId;
            DELETE FROM Selection WHERE GameId in (Select GameId from Game Where SeasonId = @seasonId);",

            new { seasonId });
    }

    public async Task<Draft?> GetActiveDraftAsync(int seasonId)
    {
        using var conn = _db.Open();
        return await conn.QuerySingleOrDefaultAsync<Draft>(
            "SELECT * FROM Draft WHERE SeasonId=@seasonId AND IsActive=1",
            new { seasonId });
    }

    public async Task<IEnumerable<DraftPick>> GetDraftPicksAsync(int draftId)
    {
        using var conn = _db.Open();

        var sql = @"
        SELECT
                dp.DraftPickId,
                dp.DraftId,
                dp.GameId,
                g.GameDateTime,
                dp.PickOrder,
                dp.ClaimedUtc,
                p.FirebaseUserId,
                p.DisplayName,
                pp.FirebaseUserId AS PickedById,
                pp.DisplayName AS PickedByDisplayName,
                (ISNULL(s.Quantity, 0)) AS Quantity,
                t.TeamId,
                t.Name,
                t.City,
                t.LogoUrl
            FROM DraftPick dp
                INNER JOIN Selection s
                ON dp.GameId = s.GameId and dp.DraftPickId = s.draftPickId
                left JOIN Participant p
                ON s.FirebaseUserId = p.FirebaseUserId
                left JOIN Participant pp
                ON dp.FirebaseUserId = pp.FirebaseUserId
                LEFT JOIN Game g
                ON dp.GameId = g.GameId
                LEFT JOIN Team t
                ON g.OpponentTeamId = t.TeamId
            WHERE dp.DraftId = @draftId
                AND dp.ClaimedUtc IS NOT NULL
            ORDER BY dp.PickOrder DESC, dp.ClaimedUtc DESC
";
        var picks = await conn.QueryAsync<DraftPick, Team, DraftPick>(
            sql,
            (pick, team) =>
            {
                pick.Team = team;
                return pick;
            },
            new { draftId },
            splitOn: "TeamId"
        );

        return picks;
    }
    public async Task<IEnumerable<DraftPick>> GetUpcomingPicksAsync(int draftId, int take = 3)
    {
        using var conn = _db.Open();

        var sql = @"
                    WITH PickedTickets AS (
                        SELECT s.FirebaseUserId, SUM(s.Quantity) AS Picked
                        FROM Selection s
                        INNER JOIN Game g ON s.GameId = g.GameId
                        WHERE g.SeasonId = (SELECT SeasonId FROM Draft WHERE DraftId = @draftId)
                        GROUP BY s.FirebaseUserId
                    )
                    SELECT TOP (@take) dp.*,
                        p.DisplayName,
                        ISNULL(a.TicketAllotment,0) - ISNULL(pt.Picked,0) AS RemainingTickets
                    FROM DraftPick dp
                    LEFT JOIN Participant p ON dp.FirebaseUserId = p.FirebaseUserId
                    LEFT JOIN ParticipantAllotment a ON a.FirebaseUserId = dp.FirebaseUserId AND a.SeasonId = (SELECT SeasonId FROM Draft WHERE DraftId = @draftId)
                    LEFT JOIN PickedTickets pt ON dp.FirebaseUserId = pt.FirebaseUserId
                    WHERE dp.DraftId = @draftId AND dp.ClaimedUtc IS NULL
                    ORDER BY dp.PickOrder;";

        return await conn.QueryAsync<DraftPick>(sql, new { draftId, take });
    }

    public async Task<int> GetLastPickOrderAsync(int draftId)
    {
        using var conn = _db.Open();
        var last = await conn.ExecuteScalarAsync<int?>(
            "SELECT MAX(PickOrder) FROM DraftPick WHERE DraftId=@draftId",
            new { draftId });
        return last ?? 0;
    }

    public async Task AddDraftPicksAsync(IEnumerable<DraftPick> picks)
    {
        if (picks == null || !picks.Any()) return;

        using var conn = _db.Open();
        await conn.ExecuteAsync(
            "INSERT INTO DraftPick (DraftId, FirebaseUserId, PickOrder) VALUES (@DraftId, @FirebaseUserId, @PickOrder)",
            picks);
    }

    public async Task AddDraftPickAsync(DraftPick pick)
    {
        using var conn = _db.Open();
        await conn.ExecuteAsync(
            "INSERT INTO DraftPick (DraftId, FirebaseUserId, PickOrder) VALUES (@DraftId, @FirebaseUserId, @PickOrder)",
            pick);
    }

    public async Task<bool> ClaimNextPickAsync(int draftId, string? expectedFirebaseUserId = null, int? gameId = null)
    {
        using var conn = _db.Open();
        using var tx = conn.BeginTransaction();

        var next = await conn.QuerySingleOrDefaultAsync<DraftPick>(@"
            SELECT TOP 1 *
            FROM DraftPick
            WHERE DraftId=@draftId AND ClaimedUtc IS NULL
            ORDER BY PickOrder",
            new { draftId }, tx);

        if (next is null)
        {
            tx.Commit();
            return false;
        }

        if (!string.IsNullOrEmpty(expectedFirebaseUserId) &&
            !string.Equals(expectedFirebaseUserId, next.FirebaseUserId, StringComparison.Ordinal))
        {
            tx.Rollback();
            return false;
        }

        var rows = await conn.ExecuteAsync(@"
            UPDATE DraftPick
            SET ClaimedUtc = SYSUTCDATETIME(), GameId = @gameId
            WHERE DraftPickId=@id AND ClaimedUtc IS NULL",
            new { id = next.DraftPickId, gameId = gameId }, tx);

        if (rows == 0)
        {
            tx.Rollback();
            return false;
        }

        tx.Commit();
        return true;
    }
}