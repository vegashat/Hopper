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

    Task RemoveUnusablePicksAsync(int draftId, int seasonId);
    Task<int> GetLastPickOrderAsync(int draftId);
    Task AddDraftPicksAsync(IEnumerable<DraftPick> picks);
    Task AddDraftPickAsync(DraftPick pick);

}

public class DraftRepository : IDraftRepository
{
    private readonly Db _db;
    public DraftRepository(Db db) => _db = db;

    public async Task RemoveUnusablePicksAsync(int draftId, int seasonId)
    {
        using var conn = _db.Open();
        await conn.ExecuteAsync(@"
            DELETE dp FROM DraftPick dp
            WHERE dp.DraftId = @draftId AND dp.ClaimedUtc IS NULL
              AND (
                NOT EXISTS (SELECT 1 FROM Game WHERE SeasonId = @seasonId AND RemainingTickets >= 2)
                OR COALESCE((SELECT TicketAllotment FROM ParticipantAllotment
                    WHERE SeasonId = @seasonId AND FirebaseUserId = dp.FirebaseUserId), 0)
                   - COALESCE((SELECT SUM(s.Quantity) FROM Selection s
                       INNER JOIN Game g ON g.GameId = s.GameId
                       WHERE g.SeasonId = @seasonId AND s.FirebaseUserId = dp.FirebaseUserId), 0) < 2
              );", new { draftId, seasonId });
    }

    public async Task<Draft> StartDraftAsync(int seasonId)
    {
        using var conn = _db.Open();
        using var tx = conn.BeginTransaction();
        var id = await conn.ExecuteScalarAsync<int>(@"
            UPDATE Draft SET IsActive = 0 WHERE SeasonId = @seasonId AND IsActive = 1;
            INSERT INTO Draft (SeasonId, IsActive) VALUES (@seasonId, 1);
            SELECT CAST(SCOPE_IDENTITY() AS int);", new { seasonId }, tx);
        tx.Commit();

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
        using var tx = conn.BeginTransaction();
        await conn.ExecuteAsync(@"
            DELETE FROM Selection WHERE DraftPickId IN (
                SELECT dp.DraftPickId FROM DraftPick dp
                INNER JOIN Draft d ON d.DraftId = dp.DraftId
                WHERE d.SeasonId = @seasonId
            );
            DELETE FROM DraftPick WHERE DraftId IN (SELECT DraftId FROM Draft WHERE SeasonId=@seasonId);
            DELETE FROM Draft WHERE SeasonId=@seasonId;
            DELETE FROM Selection WHERE GameId IN (SELECT GameId FROM Game WHERE SeasonId = @seasonId);
            UPDATE Game SET RemainingTickets = 4 WHERE SeasonId = @seasonId;
            UPDATE GameRanking SET IsFulfilled = 0 WHERE SeasonId = @seasonId;",
            new { seasonId }, tx);
        tx.Commit();
    }

    public async Task<Draft?> GetActiveDraftAsync(int seasonId)
    {
        using var conn = _db.Open();
        return await conn.QuerySingleOrDefaultAsync<Draft>(
            @"SELECT DraftId, SeasonId, CreatedUtc, IsActive
              FROM Draft WHERE SeasonId = @seasonId AND IsActive = 1",
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

}
