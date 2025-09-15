using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hopper.Api.Models;

public class Team {
    public int TeamId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? LogoUrl { get; set; }
}

public class Game {
    public int GameId { get; set; }
    public int SeasonId { get; set; }
    public DateTimeOffset GameDateTime { get; set; }
    public string? Arena { get; set; }
    public int RemainingTickets { get; set; }
    public Team Opponent { get; set; } = new();
    public List<Selection> Selections { get; set; } = new();
}
