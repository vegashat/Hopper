using Hopper.Api.Repositories;
using Hopper.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<Db>();
builder.Services.AddScoped<DraftEngine>();
builder.Services.AddScoped<IParticipantRepository, ParticipantRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<ISelectionRepository, SelectionRepository>();
builder.Services.AddScoped<IDraftRepository, DraftRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();   

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

// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
// }

app.MapHub<Hopper.Api.RealTime.DraftHub>("/draftHub");
app.MapControllers();

app.UseCors("client");
app.Run();