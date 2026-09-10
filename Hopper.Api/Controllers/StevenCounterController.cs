using System.Security.Claims;
using Dapper;
using Hopper.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hopper.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/steven-counter")]
public class StevenCounterController(Db db) : ControllerBase
{
    public record Settings(bool Enabled, string? StevenId);
    public record ClickRequest(string? TargetId);
    public class CounterState
    {
        public bool Enabled { get; set; }
        public string? StevenId { get; set; }
        public long Total { get; set; }
        public DateTime? NextClickUtc { get; set; }
        public bool IsSteven { get; set; }
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        using var conn = db.Open();
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var state = await conn.QuerySingleAsync<CounterState>(
            @"SELECT s.Enabled, s.StevenId, s.Total, c.NextClickUtc
              FROM StevenCounter s LEFT JOIN StevenCounterCooldown c ON c.FirebaseUserId = @userId
              WHERE s.Id = 1", new { userId });
        state.IsSteven = state.StevenId == userId;
        return Ok(state);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Configure(Settings settings)
    {
        using var conn = db.Open();
        if (settings.Enabled && string.IsNullOrWhiteSpace(settings.StevenId))
            return BadRequest(new { message = "Choose Steven's participant account first." });
        if (settings.StevenId != null && !await conn.ExecuteScalarAsync<bool>(
            "SELECT COUNT(*) FROM Participant WHERE FirebaseUserId = @StevenId", settings))
            return BadRequest(new { message = "Participant not found." });
        await conn.ExecuteAsync("UPDATE StevenCounter SET Enabled = @Enabled, StevenId = @StevenId WHERE Id = 1", settings);
        return NoContent();
    }

    [HttpPost("reset")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reset()
    {
        using var conn = db.Open();
        await conn.ExecuteAsync("UPDATE StevenCounter SET Total = 0 WHERE Id = 1");
        return NoContent();
    }

    [HttpPost("click")]
    public async Task<IActionResult> Click(ClickRequest request)
    {
        using var conn = db.Open();
        using var tx = conn.BeginTransaction();
        // Serialize clicks and settings changes against the same row across API instances.
        var state = await conn.QuerySingleAsync<CounterState>(
            "SELECT Enabled, StevenId, Total FROM StevenCounter WITH (UPDLOCK, HOLDLOCK) WHERE Id = 1", transaction: tx);
        if (!state.Enabled || state.StevenId == null)
            return Conflict(new { message = "The counter is hidden." });
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isSteven = userId == state.StevenId;
        if (isSteven && (string.IsNullOrWhiteSpace(request.TargetId) ||
            !await conn.ExecuteScalarAsync<bool>("SELECT COUNT(*) FROM Participant WHERE FirebaseUserId = @TargetId",
                request, tx)))
            return BadRequest(new { message = "Choose a participant." });
        var coolingDown = await conn.ExecuteScalarAsync<bool>(
            "SELECT COUNT(*) FROM StevenCounterCooldown WHERE FirebaseUserId = @userId AND NextClickUtc > SYSUTCDATETIME()",
            new { userId }, tx);
        if (coolingDown)
            return StatusCode(429, new { message = "Give Steven a break! Wait for your 30-second cooldown." });
        await conn.ExecuteAsync(
            @"UPDATE StevenCounter SET Total = Total + @amount WHERE Id = 1;
              UPDATE StevenCounterCooldown SET NextClickUtc = DATEADD(second, 30, SYSUTCDATETIME()) WHERE FirebaseUserId = @userId;
              IF @@ROWCOUNT = 0 INSERT INTO StevenCounterCooldown (FirebaseUserId, NextClickUtc)
                VALUES (@userId, DATEADD(second, 30, SYSUTCDATETIME()));",
            new { userId, amount = isSteven ? 2 : 1 }, tx);
        tx.Commit();
        return Ok(new { message = isSteven
            ? "Nice try, Steven. You just screwed yourself twice."
            : "Your complaint has been forwarded directly to Steven." });
    }
}
