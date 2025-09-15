namespace Hopper.Api.Models;

public class DraftPick
{
    public long DraftPickId { get; set; }
    public int DraftId { get; set; }
    public string FirebaseUserId { get; set; } = null!;
    public int PickOrder { get; set; }
    public DateTime CreatedUtc { get; set; }
    public DateTime ClaimedUtc { get; set; }
}