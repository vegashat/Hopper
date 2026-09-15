# Draft end-to-end test

Runs real browser clicks against the real Angular app, API, and SQL Server. No API mocking.
Requires Docker, .NET 8, Node/npm, Google Chrome, and the repository's `db/backup/Hopper.bak`.

From the repository root:

```sh
npm ci --prefix Hopper.Client
npm ci --prefix e2e
bash e2e/setup.sh
npm --prefix e2e test
```

The setup restores the backup into a separate `HopperE2e` database in the
`hopper-e2e-db-1` container. Every test replaces that copy's draft/game/participant
data with six games (24 tickets), three participants with eight tickets each,
and an admin with no allotment. Never point this fixture at a real database.
The SQL fixture checks the database name before changing data.

Ports: SQL 14365, API 15154, client 4278. Playwright starts its own API/client
and refuses to reuse existing servers. The client uses the `e2e` Angular configuration.
Test-only credentials are deliberately fixed and must not be used for deployment.

The browser logs in, starts the draft through Admin, enables Only Available Games,
and alternates four-ticket picks with two-ticket picks when eligible. After every
pick it checks database-backed API totals, each game's ticket conservation, and
that sold-out cards disappear. It requires both quantities, zero tickets left,
fully satisfied allotments, and an empty final queue.

To exercise random draft ordering repeatedly:

```sh
npm --prefix e2e test -- --repeat-each=10
```

Failures retain traces/screenshots in `e2e/test-results`. View a trace with:

```sh
cd e2e
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Remove the disposable database container when finished:

```sh
docker compose -p hopper-e2e -f e2e/compose.yml down -v
```

## Verified run

2026-09-15: `npm --prefix e2e test -- --repeat-each=5` — **5 passed (57.5s)**.
The initial end-to-end run reproduced an exhausted participant at the front of
the queue. The API now removes unusable pending turns before replenishing the
queue, including clearing pending turns when no selectable tickets remain.
The availability switch uses its checked/change bindings, and Clear also resets
availability. These changes passed all five real browser runs.

This scenario uses an admin to pick for the queued participants. It does not yet
cover separate participant sessions, split picks, concurrent submissions, or
production reverse-proxy/session behavior.

## Participant wait statistics

Run just the deterministic statistics scenario:

```sh
npm --prefix e2e test -- --grep 'participant wait'
```

The fixture creates five completed turns: **Alice, Bob, Bob, Bob, Alice + Carol**.
Their pick-order numbers are **2, 5, 9, 10, 15**, representing gaps left by deleted
pending turns. The last turn is split into two selection records but counts once.

| Participant | Last Pick (turns ago) | Longest Wait (turns) |
| --- | ---: | ---: |
| Alice | 0 | 3 |
| Bob | 1 | 1 |
| Carol | 0 | 4 |
| Admin (has not picked) | 5 | 5 |

Longest Wait includes the wait before the first pick and the current wait.
An empty draft gives zero for both columns. The test then makes a real two-ticket
pick for Carol through the API and checks the open Participants page updates via
SignalR: Alice becomes 1/3, Bob 2/2, Carol 0/4, and Admin 6/6.
This exercises split-history calculations, not the split-pick dialog itself.

The original calculation failed this scenario: Alice displayed a longest wait
of 12 instead of 3 because it subtracted pick-order numbers.

Validation: `npm --prefix e2e test` — **2 passed (19.0s)** on 2026-09-15,
including the full draft and participant statistics scenarios.
