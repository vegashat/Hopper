using Microsoft.AspNetCore.Mvc;
using Hopper.Api.Models;
using Hopper.Api.Repositories;

namespace Hopper.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameRepository _repo;
    public GamesController(IGameRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Game>>> GetAll()
    {
        var games = await _repo.GetAllAsync();
        return Ok(games);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Game>> GetById(int id)
    {
        var game = await _repo.GetByIdAsync(id);
        return game is null ? NotFound() : Ok(game);
    }

    [HttpGet("season/{seasonId}")]
    public async Task<ActionResult<IEnumerable<Game>>> GetBySeason(int seasonId)
    {
        var games = await _repo.GetBySeasonAsync(seasonId);
        return Ok(games);
    }

    [HttpPost]
    public async Task<ActionResult<Game>> Create([FromBody] Game request)
    {
        var created = await _repo.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.GameId }, created);
    }

    [HttpPatch("{id}/tickets/{remainingTickets}")]
    public async Task<IActionResult> UpdateRemainingTickets(int id, int remainingTickets)
    {
        var updated = await _repo.UpdateRemainingTicketsAsync(id, remainingTickets);
        return updated ? NoContent() : NotFound();
    }
}
