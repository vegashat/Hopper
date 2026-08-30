using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Hopper.Api.Services;

public sealed class SessionAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string SchemeName = "HopperSession";
    private readonly AppSessionService _sessions;

    public SessionAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        AppSessionService sessions) : base(options, logger, encoder)
    {
        _sessions = sessions;
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authorization = Request.Headers.Authorization.ToString();
        if (!authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return Task.FromResult(AuthenticateResult.NoResult());

        var session = _sessions.Get(authorization[7..].Trim());
        if (session is null)
            return Task.FromResult(AuthenticateResult.Fail("The session is invalid or expired."));

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, session.FirebaseUserId),
            new(ClaimTypes.Name, session.FirebaseUserId)
        };
        if (session.IsAdmin) claims.Add(new Claim(ClaimTypes.Role, "Admin"));

        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, SchemeName));
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, SchemeName)));
    }
}
