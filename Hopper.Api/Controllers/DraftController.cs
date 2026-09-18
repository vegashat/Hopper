// Controllers/DraftController.cs
using Hopper.Api.Models;
using Hopper.Api.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DraftController : ControllerBase
{
    private readonly DraftEngine _engine;
    public DraftController(DraftEngine engine) => _engine = engine;

    public record AllotmentRequest(int Allotment);

    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    [HttpPut("{seasonId}/allotments/{firebaseUserId}")]
    public async Task<ActionResult<DraftStatus>> UpdateAllotment(int seasonId, string firebaseUserId, AllotmentRequest request)
    {
        try { return Ok(await _engine.UpdateAllotmentAsync(seasonId, firebaseUserId, request.Allotment)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("start/{seasonId}")]
    public async Task<ActionResult<Draft>> Start(int seasonId)
    {
        var draft = await _engine.StartDraftAsync(seasonId);
        return Ok(draft);
    }

    [HttpPost("reset/{seasonId}")]
    public async Task<IActionResult> Reset(int seasonId)
    {
        await _engine.ResetDraftAsync(seasonId);
        return Ok(new { message = "Reset complete." });
    }

    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    [HttpPost("skip/{seasonId}")]
    public async Task<IActionResult> Skip(int seasonId)
    {
        return await _engine.SkipNextPickAsync(seasonId)
            ? Ok(new { message = "Current pick skipped." })
            : BadRequest(new { message = "No upcoming pick is available to skip." });
    }

    // Upcoming queue (always the first up to 3 unclaimed)
    [HttpGet("{seasonId}/next")]
    public async Task<ActionResult<IEnumerable<DraftPick>>> Next(int seasonId)
    {
        try { return Ok(await _engine.GetUpcomingAsync(seasonId)); }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
    }

    // Full history
    [HttpGet("{seasonId}/history")]
    public async Task<ActionResult<IEnumerable<DraftPick>>> History(int seasonId)
    {
        try { return Ok(await _engine.GetHistoryAsync(seasonId)); }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
    }

    [HttpGet("{seasonId}/simulate")]
    public async Task<ActionResult<IEnumerable<SimulatedPick>>> Simulate(int seasonId, [FromQuery] int count = 20)
    {
        var picks = await _engine.SimulateDraftAsync(seasonId, count);
        return Ok(picks);
    }
    [HttpGet("{seasonId}/status")]
    public async Task<ActionResult<DraftStatus>> Status(int seasonId)
    {
        try
        {
            var dto = await _engine.BuildStatusAsync(seasonId);
            return Ok(dto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
