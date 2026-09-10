using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Hopper.Api.Services;

public sealed class SessionAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string SchemeName = "HopperSession";
    public const string CookieName = "hopper_session";
    private readonly AppSessionService _sessions;
    private readonly Hopper.Api.Repositories.IParticipantRepository _participants;

    public SessionAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        AppSessionService sessions, Hopper.Api.Repositories.IParticipantRepository participants) : base(options, logger, encoder)
    {
        _sessions = sessions;
        _participants = participants;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authorization = Request.Headers.Authorization.ToString();
        var token = authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            ? authorization[7..].Trim()
            : Request.Cookies[CookieName];
        if (string.IsNullOrWhiteSpace(token))
            return AuthenticateResult.NoResult();

        var session = _sessions.Get(token);
        if (session is null)
            return AuthenticateResult.Fail("The session is invalid or expired.");

        var participant = await _participants.GetByIdAsync(session.FirebaseUserId);
        if (participant == null || participant.SessionVersion != session.SessionVersion)
            return AuthenticateResult.Fail("The PIN was reset. Please log in again.");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, session.FirebaseUserId),
            new(ClaimTypes.Name, session.FirebaseUserId)
        };
        if (participant.IsAdmin) claims.Add(new Claim(ClaimTypes.Role, "Admin"));

        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, SchemeName));
        return AuthenticateResult.Success(new AuthenticationTicket(principal, SchemeName));
    }
}
