# Hopper

Hopper contains a .NET API, an Angular client, and a SQL Server container.

## Local API setup

Store the development database connection outside source control:

```sh
dotnet user-secrets --project Hopper.Api set "ConnectionStrings:Default" "Server=localhost,1435;Database=Hopper;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True"
```

## Docker setup

Copy `.env.example` to `.env`, replace the example password, then run:

```sh
docker compose up --build
```

Previously committed database passwords should be rotated before deployment.

The SQL Server container applies [db/migrate.sql](db/migrate.sql) after restoring the
database. If the API points at a separately managed SQL Server, run that migration
against the Hopper database before starting the API.
