#!/bin/bash
set -e

SA_PASSWORD="${SA_PASSWORD:-${MSSQL_SA_PASSWORD:-YourStrong!Passw0rd}}"
DB_NAME="${DB_NAME:-Hopper}"
BAK_PATH="${BAK_PATH:-/var/opt/sqlserver/backup/Hopper.bak}"
FORCE_RESTORE="${FORCE_RESTORE:-0}"

if command -v /opt/mssql-tools18/bin/sqlcmd >/dev/null 2>&1; then
  SQLCMD="/opt/mssql-tools18/bin/sqlcmd"
elif command -v /opt/mssql-tools/bin/sqlcmd >/dev/null 2>&1; then
  SQLCMD="/opt/mssql-tools/bin/sqlcmd"
else
  echo "sqlcmd not found"; exit 1
fi

TRIES=60
i=0
until $SQLCMD -C -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" >/dev/null 2>&1; do
  i=$((i+1))
  if [ $i -ge $TRIES ]; then
    echo "SQL Server did not become ready in time."
    exit 1
  fi
  sleep 1
done

if [ ! -f "$BAK_PATH" ]; then
  echo "Backup file not found at $BAK_PATH. Skipping restore."
  exit 0
fi

DB_EXISTS=$($SQLCMD -C -S localhost -U sa -P "$SA_PASSWORD" -h -1 -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.databases WHERE name = N'$DB_NAME'" | tr -d '\r')

if [ "$DB_EXISTS" -eq 0 ] || [ "$FORCE_RESTORE" -eq 1 ]; then
  echo "Restoring $DB_NAME from $BAK_PATH..."
  $SQLCMD -C -S localhost -U sa -P "$SA_PASSWORD" -Q "
  IF DB_ID(N'$DB_NAME') IS NOT NULL
  BEGIN
     ALTER DATABASE [$DB_NAME] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
  END;
  RESTORE DATABASE [$DB_NAME]
  FROM DISK = N'$BAK_PATH'
  WITH REPLACE,
       MOVE '$DB_NAME'        TO '/var/opt/mssql/data/$DB_NAME.mdf',
       MOVE '${DB_NAME}_log'  TO '/var/opt/mssql/data/${DB_NAME}_log.ldf';
  IF DB_ID(N'$DB_NAME') IS NOT NULL
  BEGIN
     ALTER DATABASE [$DB_NAME] SET MULTI_USER;
  END;"
  echo "Restore completed."
else
  echo "Database $DB_NAME already exists and FORCE_RESTORE=0; skipping restore."
fi
