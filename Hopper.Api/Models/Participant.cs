namespace Hopper.Api.Models;

public class Participant
{
    public string FirebaseUserId { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string? Email { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedUtc { get; set; }
    public int AllottedTickets { get; set; }
    public string Pin { get; set; }
}