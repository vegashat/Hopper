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

## PIN recovery

Participants can use **Forgot PIN?** once per account, across all seasons. They
enter and confirm a new PIN, then log in. No email verification is required.
Subsequent resets must be requested from an administrator.

In **Admin → Participants**, **Reset PIN** clears the selected participant's PIN.
They choose a new PIN at their next login. This does not restore self-service
recovery. Both reset paths invalidate existing sessions for that participant.
The participant table now uses live API data instead of demonstration entries.

Apply `db/migrate.sql` before deploying this API version. It adds `PinResetUsed`
and `SessionVersion` without changing existing PINs.

To verify against a development database, use a disposable participant: set a PIN,
reset it through Forgot PIN, and check that the old PIN and old session no longer
work. A second self-service reset must fail, including direct API requests.
As an administrator, clear the PIN and confirm the participant can set a new one
but still cannot self-reset. A non-admin request to the admin reset endpoint must
be rejected. Two simultaneous self-service requests must yield only one success.
