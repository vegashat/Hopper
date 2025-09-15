using Dapper;
using Hopper.Api.Models;

namespace Hopper.Api.Repositories;

public interface IGameRepository
{
    Task<IEnumerable<Game>> GetAllAsync();
    Task<Game?> GetByIdAsync(int gameId);
    Task<IEnumerable<Game>> GetBySeasonAsync(int seasonId);
    Task<Game> CreateAsync(Game game);
    Task<bool> UpdateRemainingTicketsAsync(int gameId, int remainingTickets);
}

public class GameRepository : IGameRepository
{
    private readonly Db _db;
    public GameRepository(Db db) => _db = db;

    public async Task<IEnumerable<Game>> GetAllAsync()
    {
        using var conn = _db.Open();

        var sql = @"
        SELECT g.GameId, g.SeasonId, g.GameDateTime, g.Arena, g.RemainingTickets,
               t.TeamId, t.Name, t.City, t.LogoUrl,
               s.SelectionId, s.FirebaseUserId, s.Quantity,
               u.DisplayName
        FROM vw_game g
        INNER JOIN Team t ON g.OpponentTeamId = t.TeamId
        LEFT JOIN Selection s ON g.GameId = s.GameId
        LEFT JOIN [User] u ON s.FirebaseUserId = u.FirebaseUserId
        ORDER BY g.GameDateTime";

        var gameDict = new Dictionary<int, Game>();

        var result = await conn.QueryAsync<Game, Team, Selection, Game>(
            sql,
            (game, team, selection) =>
            {
                if (!gameDict.TryGetValue(game.GameId, out var g))
                {
                    g = game;
                    g.Opponent = team;
                    g.Selections = new List<Selection>();
                    gameDict.Add(g.GameId, g);
                }

                if (selection != null)
                {
                    selection.DisplayName ??= selection.FirebaseUserId;
                    g.Selections.Add(selection);
                }

                return g;
            },
            splitOn: "TeamId,SelectionId");

        return result.Distinct().ToList();
    }

    public async Task<Game?> GetByIdAsync(int gameId)
    {
        using var conn = _db.Open();
        var sql = @"
        SELECT g.GameId, g.SeasonId, g.GameDateTime, g.Arena, g.RemainingTickets,
               t.TeamId, t.Name, t.City, t.LogoUrl,
               s.SelectionId, s.FirebaseUserId, s.Quantity,
               u.DisplayName
        FROM vw_game g
        INNER JOIN Team t ON g.OpponentTeamId = t.TeamId
        LEFT JOIN Selection s ON g.GameId = s.GameId
        LEFT JOIN [User] u ON s.FirebaseUserId = u.FirebaseUserId
        WHERE g.GameId = @gameId
        ORDER BY g.GameDateTime";

        var result = await conn.QueryAsync<Game, Team, Game>(
            sql,
            (game, team) =>
            {
                game.Opponent = team;
                return game;
            },
            new { gameId },
            splitOn: "TeamId");

        return result.FirstOrDefault();
    }

    public async Task<IEnumerable<Game>> GetBySeasonAsync(int seasonId)
    {
        using var conn = _db.Open();

        var sql = @"
        SELECT g.GameId, g.SeasonId, g.GameDateTime, g.Arena, g.RemainingTickets,
               t.TeamId, t.Name, t.City, t.LogoUrl,
               s.SelectionId, s.FirebaseUserId, s.Quantity,
               u.DisplayName
        FROM vw_game g
        INNER JOIN Team t ON g.OpponentTeamId = t.TeamId
        LEFT JOIN Selection s ON g.GameId = s.GameId
        LEFT JOIN [User] u ON s.FirebaseUserId = u.FirebaseUserId
        WHERE g.SeasonId = @seasonId
        ORDER BY g.GameDateTime";

        return await conn.QueryAsync<Game, Team, Game>(
            sql,
            (game, team) =>
            {
                game.Opponent = team;
                return game;
            },
            new { seasonId },
            splitOn: "TeamId");
    }

    public async Task<Game> CreateAsync(Game game)
    {
        using var conn = _db.Open();

        var sql = @"
            INSERT INTO Game (SeasonId, OpponentTeamId, GameDateTime, Arena, RemainingTickets)
            VALUES (@SeasonId, @OpponentTeamId, @GameDateTime, @Arena, @RemainingTickets);
            SELECT CAST(SCOPE_IDENTITY() as int);";

        var id = await conn.ExecuteScalarAsync<int>(sql, new
        {
            game.SeasonId,
            OpponentTeamId = game.Opponent.TeamId,
            game.GameDateTime,
            game.Arena,
            game.RemainingTickets
        });

        game.GameId = id;
        return game;
    }

    public async Task<bool> UpdateRemainingTicketsAsync(int gameId, int remainingTickets)
    {
        using var conn = _db.Open();
        var rows = await conn.ExecuteAsync(
            "UPDATE Game SET RemainingTickets = @remainingTickets WHERE GameId = @gameId",
            new { gameId, remainingTickets });
        return rows > 0;
    }
}