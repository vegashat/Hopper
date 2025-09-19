using Microsoft.AspNetCore.Mvc;
using Hopper.Api.Models;
using Hopper.Api.Repositories;
using Hopper.Api.Services;
using Hopper.Api.RealTime;
using Microsoft.AspNetCore.SignalR;

namespace Hopper.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SelectionsController : ControllerBase
{
    private readonly ISelectionRepository _repo;
    private readonly IGameRepository _gameRepo;
    private readonly DraftEngine _draftEngine;
    private readonly IHubContext<DraftHub> _hub;
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
        try
        {
            var created = await _repo.CreateAsync(request[0]);
            //See if this is a split request.
            if (request.Length > 1)
            {
                await _repo.CreateAsync(request[1]);
                created.Quantity += request[1].Quantity;
            }

            // Advance draft queue
            await _draftEngine.AdvanceQueueAfterSelectionAsync(seasonId, request[0].FirebaseUserId, request[0].GameId);

            // 🔑 Fetch updated game so clients know about remaining tickets
            var updatedGame = await _gameRepo.GetByIdAsync(request[0].GameId);

            // Broadcast selection with updated game info
            await _hub.Clients.Group(DraftHub.SeasonGroup(seasonId.ToString()))
                .SendAsync("SelectionMade", new
                {
                    Selection = created,
                    Game = updatedGame
                });

            var upcoming = await _draftEngine.GetUpcomingAsync(seasonId, 3);
            await _hub.Clients.Group(DraftHub.SeasonGroup(seasonId.ToString()))
                .SendAsync("QueueUpdated", upcoming);

            return CreatedAtAction(nameof(GetByUser),
                new { firebaseUserId = created.FirebaseUserId },
                created);
        }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
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