using Microsoft.AspNetCore.SignalR;

namespace Hopper.Api.RealTime;

public class DraftHub : Hub
{
    // Clients will call JoinSeason to receive only messages for their season
    public Task JoinSeason(string seasonId) => Groups.AddToGroupAsync(Context.ConnectionId, SeasonGroup(seasonId));
    public Task LeaveSeason(string seasonId) => Groups.RemoveFromGroupAsync(Context.ConnectionId, SeasonGroup(seasonId));

    internal static string SeasonGroup(string seasonId) => $"season:{seasonId}";
}