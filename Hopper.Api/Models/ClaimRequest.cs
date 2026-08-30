namespace Hopper.Api.Models;

public class ClaimRequest
{
    public string FirebaseUserId { get; set; } = string.Empty;
    public string Pin { get; set; } = string.Empty;
}
