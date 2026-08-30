using Microsoft.AspNetCore.Mvc;
using Hopper.Api.Models;
using Hopper.Api.Repositories;
using Hopper.Api.Services;
using Hopper.Api.RealTime;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Hopper.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SelectionsController : ControllerBase
{
    private readonly ISelectionRepository _repo;
    private readonly IGameRepository _gameRepo;
    private readonly DraftEngine _draftEngine;
    private readonly IHubContext<DraftHub> _hub;
    private static readonly ConcurrentDictionary<int, SemaphoreSlim> _seasonLocks = new();
    private SemaphoreSlim GetSeasonLock(int seasonId) =>
            _seasonLocks.GetOrAdd(seasonId, _ => new SemaphoreSlim(1, 1));

    public SelectionsController(ISelectionRepository repo, IGameRepository gameRepo, DraftEngine draftEngine, IHubContext<DraftHub> hub)
    {
        _repo = repo;
        _gameRepo = gameRepo;
        _draftEngine = draftEngine;
        _hub = hub;
    }

    [HttpPost("{seasonId}")]
    public async Task<ActionResult<Selection>> Create(int seasonId, [FromBody] Selection[] request)
    {
        var seasonLock = GetSeasonLock(seasonId + (int)request.First().SelectionId);
        await seasonLock.WaitAsync();
        try
        {
            var created = _repo.CreateAsync(request[0]);
            //See if this is a split request.
            if (request.Length > 1)
            {
                _repo.CreateAsync(request[1]);
                created.Quantity += request[1].Quantity;
            }

            // Advance draft queue
            await _draftEngine.AdvanceQueueAfterSelectionAsync(seasonId, request[0].FirebaseUserId, request[0].GameId);

            // 🔑 Fetch updated game so clients know about remaining tickets
            var updatedGame = await _gameRepo.GetByIdAsync(request[0].GameId);
            var upcoming = await _draftEngine.GetUpcomingAsync(seasonId, 3);

            // Broadcast selection with updated game info
            await _hub.Clients.Group(DraftHub.SeasonGroup(seasonId.ToString()))
                .SendAsync("SelectionMade", new
                {
                    Selection = created,
                    Game = updatedGame
                });

            await _hub.Clients.Group(DraftHub.SeasonGroup(seasonId.ToString()))
                .SendAsync("QueueUpdated", upcoming);

            return CreatedAtAction(nameof(GetByUser),
                new { firebaseUserId = created.FirebaseUserId },
                created);
        }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
        finally
        {
            seasonLock.Release();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repo.DeleteAsync(id);
        return Ok();
    }

    [HttpGet("user/{firebaseUserId}")]
    public async Task<ActionResult<IEnumerable<Selection>>> GetByUser(string firebaseUserId)
    {
        var selections = await _repo.GetByUserAsync(firebaseUserId);
        return Ok(selections);
    }

    [HttpGet("game/{gameId}")]
    public async Task<ActionResult<IEnumerable<Selection>>> GetByGame(int gameId)
    {
        var selections = await _repo.GetByGameAsync(gameId);
        return Ok(selections);
    }
}