namespace Hopper.Api.Models;

public class Game
{
    public int GameId { get; set; }
    public int SeasonId { get; set; }
    public DateTimeOffset GameDateTime { get; set; }
    public string? Arena { get; set; }
    public int RemainingTickets { get; set; }
    public Team Opponent { get; set; } = new();
    public List<Selection> Selections { get; set; } = new();
}
