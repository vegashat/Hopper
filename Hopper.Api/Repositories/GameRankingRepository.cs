using Dapper;
using Hopper.Api.Models;

namespace Hopper.Api.Repositories;

public interface IGameRankingRepository
{
    Task<IReadOnlyList<GameRanking>> GetAsync(int seasonId, string firebaseUserId);
    Task ReplaceAsync(int seasonId, string firebaseUserId, IReadOnlyList<SaveGameRanking> rankings);
    Task<GameRanking?> GetFirstAvailableAsync(int seasonId, string firebaseUserId, int participantTicketsRemaining);
}

public class GameRankingRepository : IGameRankingRepository
{
    private readonly Db _db;
    public GameRankingRepository(Db db) => _db = db;

    public async Task<IReadOnlyList<GameRanking>> GetAsync(int seasonId, string firebaseUserId)
    {
        using var conn = _db.Open();
        var rankings = await conn.QueryAsync<GameRanking>(@"
            SELECT GameRankingId, SeasonId, FirebaseUserId, GameId, RankOrder, Quantity, IsFulfilled
            FROM GameRanking
            WHERE SeasonId = @seasonId AND FirebaseUserId = @firebaseUserId
            ORDER BY RankOrder;", new { seasonId, firebaseUserId });
        return rankings.AsList();
    }

    public async Task ReplaceAsync(
        int seasonId,
        string firebaseUserId,
        IReadOnlyList<SaveGameRanking> rankings)
    {
        if (rankings.Any(r => r.Quantity is not (2 or 4)))
            throw new ArgumentException("Each ranked game must request 2 or 4 tickets.");
        if (rankings.Select(r => r.GameId).Distinct().Count() != rankings.Count)
            throw new ArgumentException("A game can only appear once in the rankings.");

        using var conn = _db.Open();
        using var tx = conn.BeginTransaction();
        try
        {
            var draftIsActive = await conn.ExecuteScalarAsync<bool>(@"
                SELECT CASE WHEN EXISTS (
                    SELECT 1 FROM Draft WITH (UPDLOCK, HOLDLOCK)
                    WHERE SeasonId = @seasonId AND IsActive = 1
                ) THEN 1 ELSE 0 END;", new { seasonId }, tx);
            if (draftIsActive)
                throw new InvalidOperationException("Game rankings cannot be changed after the draft starts.");

            var validGameCount = rankings.Count == 0 ? 0 : await conn.ExecuteScalarAsync<int>(@"
                SELECT COUNT(*) FROM Game
                WHERE SeasonId = @seasonId AND GameId IN @gameIds;",
                new { seasonId, gameIds = rankings.Select(r => r.GameId) }, tx);
            if (validGameCount != rankings.Count)
                throw new ArgumentException("One or more ranked games are not in this season.");

            await conn.ExecuteAsync(@"
                DELETE FROM GameRanking
                WHERE SeasonId = @seasonId AND FirebaseUserId = @firebaseUserId;",
                new { seasonId, firebaseUserId }, tx);

            if (rankings.Count > 0)
            {
                var rows = rankings.Select((ranking, index) => new
                {
                    SeasonId = seasonId,
                    FirebaseUserId = firebaseUserId,
                    ranking.GameId,
                    RankOrder = index + 1,
                    ranking.Quantity
                });
                await conn.ExecuteAsync(@"
                    INSERT INTO GameRanking (SeasonId, FirebaseUserId, GameId, RankOrder, Quantity)
                    VALUES (@SeasonId, @FirebaseUserId, @GameId, @RankOrder, @Quantity);", rows, tx);
            }
            tx.Commit();
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    public async Task<GameRanking?> GetFirstAvailableAsync(
        int seasonId,
        string firebaseUserId,
        int participantTicketsRemaining)
    {
        using var conn = _db.Open();
        return await conn.QueryFirstOrDefaultAsync<GameRanking>(@"
            SELECT TOP (1) r.GameRankingId, r.SeasonId, r.FirebaseUserId,
                   r.GameId, r.RankOrder, r.Quantity, r.IsFulfilled
            FROM GameRanking r
            INNER JOIN Game g ON g.GameId = r.GameId AND g.SeasonId = r.SeasonId
            WHERE r.SeasonId = @seasonId
              AND r.FirebaseUserId = @firebaseUserId
              AND r.IsFulfilled = 0
              AND r.Quantity <= @participantTicketsRemaining
              AND g.RemainingTickets >= r.Quantity
            ORDER BY r.RankOrder;",
            new { seasonId, firebaseUserId, participantTicketsRemaining });
    }
}
