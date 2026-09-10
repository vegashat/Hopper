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

## Steven counter

Apply `db/migrate.sql`, then open **Admin → Fun**, choose Steven's participant
account, check **Show counter on draft screen**, and save. It starts hidden.
Signed-in participants see the counter on **Draft Status**, refreshed every five
seconds. Each participant has a server-enforced 30-second cooldown that persists
across reloads and API restarts. Steven's clicks add two; everyone else's add one.
This feature never changes draft order, rankings, or selections.

Admins can hide the feature or reset its total. Resetting the total preserves
cooldowns. The total is shared across seasons until an admin resets it.

For a development database check, enable the feature and click as an ordinary
participant (+1), then immediately click again (HTTP 429, total unchanged).
Sign in as the configured Steven and choose a participant (+2 and the backfire
message). Check the total in another browser, hide the feature and verify clicks
are rejected, then confirm a non-admin cannot change settings or reset the total.
