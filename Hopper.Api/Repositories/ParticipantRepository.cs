using Dapper;
using Hopper.Api.Models;

namespace Hopper.Api.Repositories;

public interface IParticipantRepository
{
    Task UpdateAllotmentAsync(int seasonId, string firebaseUserId, int allotment);
    Task<Participant?> GetByIdAsync(string firebaseUserId);
    Task<Participant> CreateAsync(Participant participant);
    Task<bool> ResetPinAsync(string firebaseUserId, string? pin, bool admin);
    Task<bool> UpdatePinAsync(Participant participant, string? expectedPin);
    Task<IEnumerable<Participant>> GetAllAsync(int? seasonId = null);
    Task<IEnumerable<ParticipantAllotment>> GetAllotmentsBySeasonAsync(int seasonId);
}

public class ParticipantRepository : IParticipantRepository
{
    private readonly Db _db;
    public ParticipantRepository(Db db) => _db = db;

    public async Task UpdateAllotmentAsync(int seasonId, string firebaseUserId, int allotment)
    {
        using var conn = _db.Open();
        using var tx = conn.BeginTransaction(System.Data.IsolationLevel.Serializable);
        // Serialize allotment edits for the season, including participants with no row yet.
        var existing = (await conn.QueryAsync<ParticipantAllotment>(
            "SELECT FirebaseUserId, SeasonId, TicketAllotment FROM ParticipantAllotment WITH (UPDLOCK, HOLDLOCK) WHERE SeasonId = @seasonId",
            new { seasonId }, tx)).ToList();
        var capacity = await conn.ExecuteScalarAsync<int>(
            "SELECT COUNT(*) * 4 FROM Game WHERE SeasonId = @seasonId", new { seasonId }, tx);
        var picked = await conn.ExecuteScalarAsync<int>(
            @"SELECT COALESCE(SUM(s.Quantity), 0) FROM Selection s
              INNER JOIN Game g ON g.GameId = s.GameId
              WHERE g.SeasonId = @seasonId AND s.FirebaseUserId = @firebaseUserId",
            new { seasonId, firebaseUserId }, tx);
        var total = existing.Where(a => a.FirebaseUserId != firebaseUserId).Sum(a => (long)a.TicketAllotment) + allotment;
        if (allotment < 0 || allotment < picked || total > capacity)
            throw new InvalidOperationException($"Allotment must be at least {picked}. Total allotments cannot exceed {capacity} tickets (games × 4).");
        if (await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Participant WHERE FirebaseUserId = @firebaseUserId", new { firebaseUserId }, tx) == 0)
            throw new InvalidOperationException("Participant not found.");
        await conn.ExecuteAsync(@"
            UPDATE ParticipantAllotment SET TicketAllotment = @allotment
            WHERE SeasonId = @seasonId AND FirebaseUserId = @firebaseUserId;
            IF @@ROWCOUNT = 0
                INSERT INTO ParticipantAllotment (SeasonId, FirebaseUserId, TicketAllotment)
                VALUES (@seasonId, @firebaseUserId, @allotment);",
            new { seasonId, firebaseUserId, allotment }, tx);
        // Remove turns that the participant can no longer use after a reduction.
        await conn.ExecuteAsync(@"
            DELETE dp FROM DraftPick dp
            INNER JOIN Draft d ON d.DraftId = dp.DraftId
            WHERE d.SeasonId = @seasonId AND d.IsActive = 1
              AND dp.FirebaseUserId = @firebaseUserId AND dp.ClaimedUtc IS NULL
              AND @allotment - @picked < 2;",
            new { seasonId, firebaseUserId, allotment, picked }, tx);
        tx.Commit();
    }

    public async Task<Participant?> GetByIdAsync(string firebaseUserId)
    {
        using var conn = _db.Open();
        return await conn.QuerySingleOrDefaultAsync<Participant>(
            @"SELECT FirebaseUserId, DisplayName, Email, IsAdmin, CreatedUtc, Pin, PinResetUsed, SessionVersion
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

    public async Task<IEnumerable<Participant>> GetAllAsync(int? seasonId = null)
    {
        using var conn = _db.Open();
        return await conn.QueryAsync<Participant>(
            @"SELECT p.FirebaseUserId, p.DisplayName, p.Email, p.IsAdmin, p.CreatedUtc, p.Pin, p.PinResetUsed, p.SessionVersion,
                     COALESCE(a.TicketAllotment, 0) AS AllottedTickets
              FROM Participant p
              LEFT JOIN ParticipantAllotment a
                ON a.FirebaseUserId = p.FirebaseUserId AND a.SeasonId = @seasonId
              ORDER BY p.DisplayName", new { seasonId });
    }

    public async Task<bool> ResetPinAsync(string firebaseUserId, string? pin, bool admin)
    {
        using var conn = _db.Open();
        return await conn.ExecuteAsync(
            @"UPDATE Participant SET Pin = @pin, PinResetUsed = 1,
                SessionVersion = SessionVersion + 1
              WHERE FirebaseUserId = @firebaseUserId
                AND (@admin = 1 OR (PinResetUsed = 0 AND Pin IS NOT NULL))",
            new { firebaseUserId, pin, admin }) > 0;
    }

    public async Task<bool> UpdatePinAsync(Participant participant, string? expectedPin)
    {
        using var conn = _db.Open();
        var rows = await conn.ExecuteAsync(
            "UPDATE Participant SET Pin = @pin WHERE firebaseUserId = @firebaseUserId AND SessionVersion = @SessionVersion AND (Pin = @expectedPin OR (Pin IS NULL AND @expectedPin IS NULL))",
            new { participant.Pin, participant.FirebaseUserId, participant.SessionVersion, expectedPin });
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
