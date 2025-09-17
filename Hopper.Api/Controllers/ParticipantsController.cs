using Microsoft.AspNetCore.Mvc;
using Hopper.Api.Repositories;
using Hopper.Api.Models;

namespace Hopper.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParticipantsController : ControllerBase
{
    private readonly IParticipantRepository _repo;

    public ParticipantsController(IParticipantRepository repo)
    {
        _repo = repo;
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

        if (participant.Pin is null && req.Pin.Length > 0 )
        {
            // First time claim → set PIN
            participant.Pin = req.Pin;
            await _repo.UpdatePinAsync(participant);
            return Ok(new { success = true, message = "PIN set. Account claimed!" });
        }
        else
        {
            // Already has PIN → must match
            if (participant.Pin == req.Pin && participant.Pin.Length > 0)
                return Ok(new { success = true, message = "Login successful!" });

            return Unauthorized(new { success = false, message = "Invalid PIN." });
        }
    }

}