using Hopper.Api.Models;
using Hopper.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Hopper.Api.Controllers;

[ApiController]
[Route("api/seasons/{seasonId:int}/game-rankings")]
public class GameRankingsController : ControllerBase
{
    private readonly IGameRankingRepository _rankings;
    public GameRankingsController(IGameRankingRepository rankings) => _rankings = rankings;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GameRanking>>> Get(
        int seasonId,
        [FromQuery] string firebaseUserId)
    {
        if (string.IsNullOrWhiteSpace(firebaseUserId))
            return BadRequest("firebaseUserId is required.");
        return Ok(await _rankings.GetAsync(seasonId, firebaseUserId));
    }

    [HttpPut]
    public async Task<IActionResult> Replace(
        int seasonId,
        [FromQuery] string firebaseUserId,
        [FromBody] SaveGameRanking[] rankings)
    {
        if (string.IsNullOrWhiteSpace(firebaseUserId))
            return BadRequest("firebaseUserId is required.");
        try
        {
            await _rankings.ReplaceAsync(seasonId, firebaseUserId, rankings);
            return NoContent();
        }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
        catch (InvalidOperationException ex) { return Conflict(ex.Message); }
    }
}
