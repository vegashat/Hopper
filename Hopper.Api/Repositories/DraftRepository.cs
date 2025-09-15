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
    Task<bool> ClaimNextPickAsync(int draftId, string? expectedFirebaseUserId = null);
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
            DELETE FROM DraftPick WHERE DraftId IN (SELECT DraftId FROM Draft WHERE SeasonId=@seasonId);
            DELETE FROM Draft WHERE SeasonId=@seasonId;",
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
        return await conn.QueryAsync<DraftPick>(
            "SELECT * FROM DraftPick WHERE DraftId=@draftId ORDER BY PickOrder",
            new { draftId });
    }

    public async Task<IEnumerable<DraftPick>> GetUpcomingPicksAsync(int draftId, int take = 3)
    {
        using var conn = _db.Open();
        return await conn.QueryAsync<DraftPick>(@"
            SELECT TOP (@take) *
            FROM DraftPick
            WHERE DraftId=@draftId AND ClaimedUtc IS NULL
            ORDER BY PickOrder",
            new { draftId, take });
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

    public async Task<bool> ClaimNextPickAsync(int draftId, string? expectedFirebaseUserId = null)
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
            SET ClaimedUtc = SYSUTCDATETIME()
            WHERE DraftPickId=@id AND ClaimedUtc IS NULL",
            new { id = next.DraftPickId }, tx);

        if (rows == 0)
        {
            tx.Rollback();
            return false;
        }

        tx.Commit();
        return true;
    }
}