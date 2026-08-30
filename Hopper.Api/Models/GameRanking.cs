namespace Hopper.Api.Models;

public class GameRanking
{
    public long GameRankingId { get; set; }
    public int SeasonId { get; set; }
    public string FirebaseUserId { get; set; } = string.Empty;
    public int GameId { get; set; }
    public int RankOrder { get; set; }
    public byte Quantity { get; set; }
    public bool IsFulfilled { get; set; }
}

public class SaveGameRanking
{
    public int GameId { get; set; }
    public byte Quantity { get; set; }
}
