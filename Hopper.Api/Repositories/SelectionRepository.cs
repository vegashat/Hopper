using Dapper;
using Hopper.Api.Models;

namespace Hopper.Api.Repositories;

public interface ISelectionRepository
{
    Task<Selection> CreateAsync(Selection selection);
    Task<IEnumerable<Selection>> GetByUserAsync(string firebaseUserId);
    Task<Selection> GetByGameAsync(int gameId);
    Task DeleteAsync(int selectionId);
    Task<IEnumerable<(string FirebaseUserId, int Tickets)>> GetPickedByUserAsync(int seasonId);
    Task<bool> AnyTicketsRemainingAsync(int seasonId);
}
public class SelectionRepository : ISelectionRepository
{
    private readonly Db _db;
    public SelectionRepository(Db db) => _db = db;

    public async Task<Selection> CreateAsync(Selection selection)
    {
        if (selection.Quantity != 2 && selection.Quantity != 4)
            throw new ArgumentException("Quantity must be 2 or 4.");

        selection.PickedUtc = DateTime.UtcNow;

        using var conn = _db.Open();
        using var tx = conn.BeginTransaction();

        // Try to decrement tickets directly (atomic check)
        var rows = await conn.ExecuteAsync(@"
        UPDATE Game
        SET RemainingTickets = RemainingTickets - @Quantity
        WHERE GameId = @GameId
          AND RemainingTickets >= @Quantity;
    ", new { selection.GameId, selection.Quantity }, tx);

        if (rows == 0)
        {
            tx.Rollback();
            throw new InvalidOperationException("Not enough tickets remaining for this game.");
        }

        // Insert selection
        var sql = @"
        INSERT INTO Selection (FirebaseUserId, GameId, Quantity, PickedUtc)
        VALUES (@FirebaseUserId, @GameId, @Quantity, @PickedUtc);
        SELECT CAST(SCOPE_IDENTITY() as bigint);";

        var id = await conn.ExecuteScalarAsync<long>(sql, selection, tx);
        selection.SelectionId = id;

        tx.Commit();

        return selection;
    }
    public async Task<bool> DeleteAsync(long selectionId)
    {
        using var conn = _db.Open();

        // Find the selection first
        var selection = await conn.QuerySingleOrDefaultAsync<Selection>(
            "SELECT * FROM Selection WHERE SelectionId = @selectionId",
            new { selectionId });

        if (selection is null)
            return false;

        // Delete the selection
        var rows = await conn.ExecuteAsync(
            "DELETE FROM Selection WHERE SelectionId = @selectionId",
            new { selectionId });

        if (rows > 0)
        {
            // Restore the tickets to the game
            await conn.ExecuteAsync(
                "UPDATE Game SET RemainingTickets = RemainingTickets + @Quantity WHERE GameId = @GameId",
                new { selection.GameId, selection.Quantity });
        }

        return rows > 0;
    }

    public async Task<IEnumerable<Selection>> GetByUserAsync(string firebaseUserId)
    {
        using var conn = _db.Open();
        return await conn.QueryAsync<Selection>(
            "SELECT * FROM Selection WHERE FirebaseUserId = @firebaseUserId ORDER BY PickedUtc DESC",
            new { firebaseUserId });
    }

    public async Task<Selection> GetByGameAsync(int gameId)
    {
        using var conn = _db.Open();
        return await conn.QuerySingleAsync<Selection>(
            "SELECT * FROM Selection WHERE GameId = @gameId ORDER BY PickedUtc ASC",
            new { gameId });
    }
    public async Task DeleteAsync(int selectionId)
    {
        using var conn = _db.Open();
        await conn.ExecuteAsync("DELETE FROM Selection WHERE SelectionId=@id", new { id = selectionId });
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