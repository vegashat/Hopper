namespace Hopper.Api.Models;

public class DraftStatus
{
    public int SeasonId { get; set; }
    public bool IsActive { get; set; }
    public IEnumerable<UpcomingPick> Upcoming { get; set; } = Enumerable.Empty<UpcomingPick>();
    public IEnumerable<HistoryPick> History { get; set; } = Enumerable.Empty<HistoryPick>();
    public IEnumerable<UserProgress> Users { get; set; } = Enumerable.Empty<UserProgress>();
    public int TotalTicketsRemaining { get; set; }
}

public class UpcomingPick
{
    public long DraftPickId { get; set; }
    public int PickOrder { get; set; }
    public string FirebaseUserId { get; set; } = "";
    public string? DisplayName { get; set; }
}

public class HistoryPick
{
    public int PickOrder { get; set; }
    public string FirebaseUserId { get; set; } = "";
    public string? DisplayName { get; set; }
    public DateTime? ClaimedUtc { get; set; }
}

public class UserProgress
{
    public string FirebaseUserId { get; set; } = "";
    public string? DisplayName { get; set; }
    public int Allotment { get; set; }
    public int Picked { get; set; }
    public int Remaining => Math.Max(0, Allotment - Picked);
}