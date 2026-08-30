using Hopper.Api.Repositories;
using Hopper.Api.Services;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<Db>();
builder.Services.AddScoped<DraftEngine>();
builder.Services.AddScoped<IParticipantRepository, ParticipantRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<ISelectionRepository, SelectionRepository>();
builder.Services.AddScoped<IDraftRepository, DraftRepository>();
builder.Services.AddSingleton<AppSessionService>();
builder.Services.AddAuthentication(SessionAuthenticationHandler.SchemeName)
    .AddScheme<AuthenticationSchemeOptions, SessionAuthenticationHandler>(SessionAuthenticationHandler.SchemeName, null);
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();   
builder.Services.AddProblemDetails();

builder.Services.AddSignalR();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("client", p => p
        .WithOrigins(["http://localhost:4200", "http://localhost:4278"])
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();

app.UseCors("client");
app.UseAuthentication();
app.UseAuthorization();

app.MapHub<Hopper.Api.RealTime.DraftHub>("/draftHub");
app.MapControllers();
app.Run();
