using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;

namespace Hopper.Api.Services;

public sealed record AppSession(string FirebaseUserId, bool IsAdmin, DateTimeOffset ExpiresAt);

public sealed class AppSessionService
{
    private static readonly TimeSpan Lifetime = TimeSpan.FromHours(12);
    private readonly ITimeLimitedDataProtector _protector;

    public AppSessionService(IDataProtectionProvider dataProtectionProvider)
    {
        _protector = dataProtectionProvider
            .CreateProtector("Hopper.AppSession.v1")
            .ToTimeLimitedDataProtector();
    }

    public string Create(string firebaseUserId, bool isAdmin)
    {
        var session = new AppSession(firebaseUserId, isAdmin, DateTimeOffset.UtcNow.Add(Lifetime));
        return _protector.Protect(JsonSerializer.Serialize(session), Lifetime);
    }

    public AppSession? Get(string token)
    {
        try
        {
            var json = _protector.Unprotect(token, out var expiresAt);
            if (expiresAt <= DateTimeOffset.UtcNow) return null;
            return JsonSerializer.Deserialize<AppSession>(json);
        }
        catch (CryptographicException)
        {
            return null;
        }
    }
}
