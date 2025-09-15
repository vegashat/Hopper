namespace Hopper.Api.Models;

public class ParticipantAllotment
{
    public string FirebaseUserId { get; set; } = null!;
    public int SeasonId { get; set; }
    public int TicketAllotment { get; set; }
}