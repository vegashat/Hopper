namespace Hopper.Api.Models;

public class Selection
{
        public long SelectionId { get; set; }
        public long DraftPickId { get; set; }
        public string FirebaseUserId { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public int GameId { get; set; }
        public byte Quantity { get; set; } // 2 or 4
        public DateTime PickedUtc { get; set; }
}
