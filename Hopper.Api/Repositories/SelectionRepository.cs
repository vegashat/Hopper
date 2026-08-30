using Dapper;
using Hopper.Api.Models;

namespace Hopper.Api.Repositories;

public interface ISelectionRepository
{
    Task<IReadOnlyList<Selection>> CreateForNextPickAsync(
        int seasonId, IReadOnlyList<Selection> selections, long? fulfilledRankingId = null);
    Task<IEnumerable<Selection>> GetByUserAsync(string firebaseUserId);
    Task<IEnumerable<Selection>> GetByGameAsync(int gameId);
    Task<bool> DeleteAsync(long selectionId);
    Task<IEnumerable<(string FirebaseUserId, int Tickets)>> GetPickedByUserAsync(int seasonId);
    Task<bool> AnyTicketsRemainingAsync(int seasonId);
}
public class SelectionRepository : ISelectionRepository
{
    private readonly Db _db;
    public SelectionRepository(Db db) => _db = db;

    public async Task<IReadOnlyList<Selection>> CreateForNextPickAsync(
        int seasonId,
        IReadOnlyList<Selection> selections,
        long? fulfilledRankingId = null)
    {
        if (selections.Count is < 1 or > 2)
            throw new ArgumentException("A pick must contain one or two selections.");
        if (selections.Any(s => s.Quantity is not (2 or 4)))
            throw new ArgumentException("Quantity must be 2 or 4.");

        var first = selections[0];
        if (selections.Any(s => s.DraftPickId != first.DraftPickId || s.GameId != first.GameId))
            throw new ArgumentException("Split selections must use the same draft pick and game.");
        if (selections.Select(s => s.FirebaseUserId).Distinct(StringComparer.Ordinal).Count() != selections.Count)
            throw new ArgumentException("A split pick must contain different participants.");

        using var conn = _db.Open();
        using var tx = conn.BeginTransaction();

        try
        {
            var next = await conn.QuerySingleOrDefaultAsync<DraftPick>(@"
                SELECT TOP (1) dp.DraftPickId, dp.DraftId, dp.FirebaseUserId, dp.PickOrder
                FROM Draft d
                INNER JOIN DraftPick dp WITH (UPDLOCK, HOLDLOCK) ON dp.DraftId = d.DraftId
                WHERE d.SeasonId = @seasonId AND d.IsActive = 1 AND dp.ClaimedUtc IS NULL
                ORDER BY dp.PickOrder;", new { seasonId }, tx);

            if (next is null)
                throw new InvalidOperationException("No upcoming draft pick is available.");
            if (next.DraftPickId != first.DraftPickId ||
                !string.Equals(next.FirebaseUserId, first.FirebaseUserId, StringComparison.Ordinal))
                throw new InvalidOperationException("This is not the participant's current draft pick.");

            foreach (var selection in selections)
            {
                var remaining = await conn.ExecuteScalarAsync<int?>(@"
                    SELECT pa.TicketAllotment - COALESCE((
                        SELECT SUM(s.Quantity)
                        FROM Selection s
                        INNER JOIN Game selectedGame ON selectedGame.GameId = s.GameId
                        WHERE s.FirebaseUserId = pa.FirebaseUserId
                          AND selectedGame.SeasonId = pa.SeasonId
                    ), 0)
                    FROM ParticipantAllotment pa WITH (UPDLOCK, HOLDLOCK)
                    WHERE pa.SeasonId = @seasonId AND pa.FirebaseUserId = @firebaseUserId;",
                    new { seasonId, selection.FirebaseUserId }, tx);

                if (remaining is null || remaining < selection.Quantity)
                    throw new InvalidOperationException($"{selection.FirebaseUserId} does not have enough tickets remaining.");

                selection.DisplayName = await conn.ExecuteScalarAsync<string?>(
                    "SELECT DisplayName FROM Participant WHERE FirebaseUserId = @firebaseUserId",
                    new { selection.FirebaseUserId }, tx);
            }

            var totalQuantity = selections.Sum(s => s.Quantity);
            var updatedGames = await conn.ExecuteAsync(@"
                UPDATE Game
                SET RemainingTickets = RemainingTickets - @totalQuantity
                WHERE GameId = @gameId AND SeasonId = @seasonId
                  AND RemainingTickets >= @totalQuantity;",
                new { totalQuantity, gameId = first.GameId, seasonId }, tx);

            if (updatedGames != 1)
                throw new InvalidOperationException("The game does not have enough tickets remaining.");

            foreach (var selection in selections)
            {
                selection.PickedUtc = DateTime.UtcNow;
                selection.SelectionId = await conn.ExecuteScalarAsync<long>(@"
                    INSERT INTO Selection (FirebaseUserId, GameId, Quantity, PickedUtc, DraftPickId)
                    VALUES (@FirebaseUserId, @GameId, @Quantity, @PickedUtc, @DraftPickId);
                    SELECT CAST(SCOPE_IDENTITY() AS bigint);", selection, tx);
            }

            var claimed = await conn.ExecuteAsync(@"
                UPDATE DraftPick
                SET ClaimedUtc = SYSUTCDATETIME(), GameId = @gameId
                WHERE DraftPickId = @draftPickId AND ClaimedUtc IS NULL;",
                new { gameId = first.GameId, draftPickId = first.DraftPickId }, tx);

            if (claimed != 1)
                throw new InvalidOperationException("The draft pick was already claimed.");

            if (fulfilledRankingId.HasValue)
            {
                var fulfilled = await conn.ExecuteAsync(@"
                    UPDATE GameRanking
                    SET IsFulfilled = 1
                    WHERE GameRankingId = @fulfilledRankingId
                      AND SeasonId = @seasonId
                      AND FirebaseUserId = @firebaseUserId
                      AND GameId = @gameId
                      AND Quantity = @quantity
                      AND IsFulfilled = 0;",
                    new
                    {
                        fulfilledRankingId,
                        seasonId,
                        first.FirebaseUserId,
                        first.GameId,
                        first.Quantity
                    }, tx);
                if (fulfilled != 1)
                    throw new InvalidOperationException("The selected game ranking is no longer available.");
            }

            tx.Commit();
            return selections;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    public async Task<bool> DeleteAsync(long selectionId)
    {
        using var conn = _db.Open();
        using var tx = conn.BeginTransaction();

        var selection = await conn.QuerySingleOrDefaultAsync<Selection>(
            @"SELECT SelectionId, DraftPickId, FirebaseUserId, GameId, Quantity, PickedUtc
              FROM Selection WHERE SelectionId = @selectionId",
            new { selectionId }, tx);

        if (selection is null)
        {
            tx.Rollback();
            return false;
        }
        try
        {
            var rows = await conn.ExecuteAsync(
                "DELETE FROM Selection WHERE SelectionId = @selectionId",
                new { selectionId }, tx);
            if (rows == 0)
            {
                tx.Rollback();
                return false;
            }

            await conn.ExecuteAsync(
                "UPDATE Game SET RemainingTickets = RemainingTickets + @Quantity WHERE GameId = @GameId",
                new { selection.GameId, selection.Quantity }, tx);
            tx.Commit();
            return true;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    public async Task<IEnumerable<Selection>> GetByUserAsync(string firebaseUserId)
    {
        using var conn = _db.Open();
        return await conn.QueryAsync<Selection>(
            @"SELECT SelectionId, DraftPickId, FirebaseUserId, GameId, Quantity, PickedUtc
              FROM Selection WHERE FirebaseUserId = @firebaseUserId ORDER BY PickedUtc DESC",
            new { firebaseUserId });
    }

    public async Task<IEnumerable<Selection>> GetByGameAsync(int gameId)
    {
        using var conn = _db.Open();
        return await conn.QueryAsync<Selection>(
            @"SELECT SelectionId, DraftPickId, FirebaseUserId, GameId, Quantity, PickedUtc
              FROM Selection WHERE GameId = @gameId ORDER BY PickedUtc ASC",
            new { gameId });
    }
    public async Task<IEnumerable<(string FirebaseUserId, int Tickets)>> GetPickedByUserAsync(int seasonId)
    {
        using var conn = _db.Open();
        var sql = @"
            SELECT s.FirebaseUserId, SUM(s.Quantity) as Tickets
            FROM Selection s
            INNER JOIN Game g ON s.GameId = g.GameId
            WHERE g.SeasonId = @seasonId
            GROUP BY s.FirebaseUserId";
        return await conn.QueryAsync<(string, int)>(sql, new { seasonId });
    }

    // Quick check if any tickets remain in the season
    public async Task<bool> AnyTicketsRemainingAsync(int seasonId)
    {
        using var conn = _db.Open();
        var sql = @"
            SELECT COUNT(*) 
            FROM Game g
            WHERE g.SeasonId=@seasonId
              AND g.RemainingTickets > 0";
        var count = await conn.ExecuteScalarAsync<int>(sql, new { seasonId });
        return count > 0;

    }
}
