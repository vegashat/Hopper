using Microsoft.AspNetCore.Mvc;
using Hopper.Api.Repositories;
using Hopper.Api.Models;
using Hopper.Api.Services;

namespace Hopper.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParticipantsController : ControllerBase
{
    private readonly IParticipantRepository _repo;
    private readonly AppSessionService _sessions;

    public ParticipantsController(IParticipantRepository repo, AppSessionService sessions)
    {
        _repo = repo;
        _sessions = sessions;
    }

    // POST api/participants
    [HttpPost]
    public async Task<ActionResult<Participant>> Create([FromBody] Participant request)
    {
        if (string.IsNullOrWhiteSpace(request.FirebaseUserId))
            return BadRequest("FirebaseUserId is required.");

        // Check if user already exists
        var existing = await _repo.GetByIdAsync(request.FirebaseUserId);
        if (existing != null)
            return Ok(existing);

        // Default new users to non-admin
        request.IsAdmin = false;

        var created = await _repo.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { firebaseUserId = created.FirebaseUserId }, created);
    }

    // GET api/participants/{firebaseUserId}
    [HttpGet("{firebaseUserId}")]
    public async Task<ActionResult<Participant>> GetById(string firebaseUserId)
    {
        var participant = await _repo.GetByIdAsync(firebaseUserId);
        return participant is null ? NotFound() : Ok(participant);
    }

    // GET api/participants
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Participant>>> GetAll()
    {
        var participants = await _repo.GetAllAsync();
        return Ok(participants);
    }

    [HttpPost("claim")]
    public async Task<IActionResult> ClaimAccount([FromBody] ClaimRequest req)
    {
        var participant = await _repo.GetByIdAsync(req.FirebaseUserId);
        if (participant == null) return NotFound();

        if (string.IsNullOrWhiteSpace(req.Pin))
            return BadRequest(new { success = false, message = "A PIN is required." });

        if (participant.Pin is null)
        {
            participant.Pin = PinHasher.Hash(req.Pin);
            await _repo.UpdatePinAsync(participant);
            var token = CreateSession(participant);
            return Ok(new {
                success = true,
                message = "PIN set. Account claimed!",
                token
            });
        }

        if (PinHasher.Verify(req.Pin, participant.Pin))
        {
            if (PinHasher.NeedsUpgrade(participant.Pin))
            {
                participant.Pin = PinHasher.Hash(req.Pin);
                await _repo.UpdatePinAsync(participant);
            }
            var token = CreateSession(participant);
            return Ok(new {
                success = true,
                message = "Login successful!",
                token
            });
        }

        return Unauthorized(new { success = false, message = "Invalid PIN." });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(SessionAuthenticationHandler.CookieName, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            Secure = Request.IsHttps,
            Path = "/"
        });
        return NoContent();
    }

    private string CreateSession(Participant participant)
    {
        var token = _sessions.Create(participant.FirebaseUserId, participant.IsAdmin);
        Response.Cookies.Append(SessionAuthenticationHandler.CookieName, token, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            Secure = Request.IsHttps,
            Path = "/",
            MaxAge = TimeSpan.FromHours(12)
        });
        return token;
    }

}
