using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace Hopper.Api.Services;

public sealed record AppSession(string FirebaseUserId, bool IsAdmin, DateTimeOffset ExpiresAt);

public sealed class AppSessionService
{
    private static readonly TimeSpan Lifetime = TimeSpan.FromHours(12);
    private readonly ConcurrentDictionary<string, AppSession> _sessions = new();

    public string Create(string firebaseUserId, bool isAdmin)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
        _sessions[token] = new AppSession(firebaseUserId, isAdmin, DateTimeOffset.UtcNow.Add(Lifetime));
        return token;
    }

    public AppSession? Get(string token)
    {
        if (!_sessions.TryGetValue(token, out var session)) return null;
        if (session.ExpiresAt > DateTimeOffset.UtcNow) return session;
        _sessions.TryRemove(token, out _);
        return null;
    }
}
