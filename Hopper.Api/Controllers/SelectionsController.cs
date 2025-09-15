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
    private readonly DraftEngine _draftEngine;
    private readonly IHubContext<DraftHub> _hub;
    public SelectionsController(ISelectionRepository repo, DraftEngine draftEngine, IHubContext<DraftHub> hub)
    {
        _repo = repo;
        _draftEngine = draftEngine;
        _hub = hub;
    }

    [HttpPost("{seasonId}")]
    public async Task<ActionResult<Selection>> Create(int seasonId, [FromBody] Selection request)
    {
        try
        {
            var created = await _repo.CreateAsync(request);

            // Advance draft queue
            await _draftEngine.AdvanceQueueAfterSelectionAsync(seasonId, request.FirebaseUserId, request.GameId);

            // Broadcast updates
            await _hub.Clients.Group(DraftHub.SeasonGroup(seasonId.ToString()))
                .SendAsync("SelectionMade", created);

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