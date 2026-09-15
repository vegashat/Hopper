#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
docker compose -p hopper-e2e -f compose.yml up -d
sql() {
  docker compose -p hopper-e2e -f compose.yml exec -T db \
    /opt/mssql-tools18/bin/sqlcmd -b -C -S localhost -U sa -P 'HopperE2e-Only!2026' "$@"
}
ready=false
for attempt in {1..60}; do
  if sql -Q 'SELECT 1' >/dev/null 2>&1; then ready=true; break; fi
  sleep 1
done
if [[ "$ready" != true ]]; then echo 'Test SQL Server did not become ready' >&2; exit 1; fi
sql -Q "IF DB_ID('HopperE2e') IS NULL RESTORE DATABASE HopperE2e FROM DISK='/backup/Hopper.bak' WITH MOVE 'Hopper' TO '/var/opt/mssql/data/HopperE2e.mdf', MOVE 'Hopper_log' TO '/var/opt/mssql/data/HopperE2e_log.ldf';"
sql -d HopperE2e -i /migrate.sql
