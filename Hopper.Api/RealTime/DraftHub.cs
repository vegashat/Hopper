using Microsoft.AspNetCore.SignalR;

namespace Hopper.Api.RealTime;

public class DraftHub : Hub
{
    private readonly ILogger<DraftHub> _logger;

    public DraftHub(ILogger<DraftHub> logger) => _logger = logger;

    public Task JoinSeason(string seasonId)
    {
        _logger.LogDebug("Client {ConnectionId} joined season {SeasonId}", Context.ConnectionId, seasonId);
        return Groups.AddToGroupAsync(Context.ConnectionId, SeasonGroup(seasonId));
    }
    public Task LeaveSeason(string seasonId) => Groups.RemoveFromGroupAsync(Context.ConnectionId, SeasonGroup(seasonId));

    internal static string SeasonGroup(string seasonId) => $"season:{seasonId}";
}
