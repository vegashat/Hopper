using Microsoft.AspNetCore.SignalR;

namespace Hopper.Api.RealTime;

public class DraftHub : Hub
{
    public Task JoinSeason(string seasonId)
    {
        Console.WriteLine($"Client {Context.ConnectionId} joined season {seasonId}");
        return Groups.AddToGroupAsync(Context.ConnectionId, SeasonGroup(seasonId));
    }
    public Task LeaveSeason(string seasonId) => Groups.RemoveFromGroupAsync(Context.ConnectionId, SeasonGroup(seasonId));

    internal static string SeasonGroup(string seasonId) => $"season:{seasonId}";
}