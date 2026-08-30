using Dapper;
using Hopper.Api.Models;

namespace Hopper.Api.Repositories;

public interface IParticipantRepository
{
    Task<Participant?> GetByIdAsync(string firebaseUserId);
    Task<Participant> CreateAsync(Participant participant);
    Task<bool> UpdatePinAsync(Participant participant);
    Task<IEnumerable<Participant>> GetAllAsync();
    Task<IEnumerable<ParticipantAllotment>> GetAllotmentsBySeasonAsync(int seasonId);
}

public class ParticipantRepository : IParticipantRepository
{
    private readonly Db _db;
    public ParticipantRepository(Db db) => _db = db;

    public async Task<Participant?> GetByIdAsync(string firebaseUserId)
    {
        using var conn = _db.Open();
        return await conn.QuerySingleOrDefaultAsync<Participant>(
            @"SELECT FirebaseUserId, DisplayName, Email, IsAdmin, CreatedUtc, Pin
              FROM Participant WHERE FirebaseUserId = @firebaseUserId",
            new { firebaseUserId });
    }

    public async Task<Participant> CreateAsync(Participant participant)
    {
        // Server-side timestamp
        participant.CreatedUtc = DateTime.UtcNow;

        using var conn = _db.Open();
        await conn.ExecuteAsync(
            @"INSERT INTO Participant (FirebaseUserId, DisplayName, Email, IsAdmin, CreatedUtc)
              VALUES (@FirebaseUserId, @DisplayName, @Email, @IsAdmin, @CreatedUtc)",
            participant);

        return participant;
    }

    public async Task<IEnumerable<Participant>> GetAllAsync()
    {
        using var conn = _db.Open();
        return await conn.QueryAsync<Participant>(
            @"SELECT p.FirebaseUserId, p.DisplayName, p.Email, p.IsAdmin, p.CreatedUtc, p.Pin,
                     CAST(0 AS int) AS AllottedTickets
              FROM Participant p
              ORDER BY p.DisplayName");
    }

    public async Task<bool> UpdatePinAsync(Participant participant)
    {
        using var conn = _db.Open();
        var rows = await conn.ExecuteAsync(
            "UPDATE Participant SET Pin = @pin WHERE firebaseUserId = @firebaseUserId",
            new { participant.Pin, participant.FirebaseUserId });
        return rows > 0;
    }

    public async Task<IEnumerable<ParticipantAllotment>> GetAllotmentsBySeasonAsync(int seasonId)
    {
        using var conn = _db.Open();
        return await conn.QueryAsync<ParticipantAllotment>(
            @"SELECT FirebaseUserId, SeasonId, TicketAllotment
              FROM ParticipantAllotment WHERE SeasonId = @seasonId",
            new { seasonId });
    }

}
