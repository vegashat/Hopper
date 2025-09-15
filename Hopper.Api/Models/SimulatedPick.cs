namespace Hopper.Api.Models;

public class SimulatedPick
{
    public int PickOrder { get; set; }
    public string FirebaseUserId { get; set; } = string.Empty;
    public bool WasForced { get; set; }     
    public bool WasRerolled { get; set; }   
    public override string ToString() =>
        $"{PickOrder}: {FirebaseUserId} (forced={WasForced}, rerolled={WasRerolled})";
}