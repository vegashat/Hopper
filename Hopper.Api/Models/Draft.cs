namespace Hopper.Api.Models;

public class Draft
{
    public int DraftId { get; set; }
    public int SeasonId { get; set; }
    public DateTime CreatedUtc { get; set; }
    public bool IsActive { get; set; }
}