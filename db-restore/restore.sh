#!/bin/bash
set -e

DB_NAME=${DB_NAME:-Hopper}
: "${SA_PASSWORD:?SA_PASSWORD must be set}"
SQL_HOST=${SQL_HOST:-hopperdb}
BAK_PATH=${BAK_PATH:-/backup/Hopper.bak}

SQLCMD=/opt/mssql-tools/bin/sqlcmd

echo "Waiting for SQL Server at $SQL_HOST..."
until $SQLCMD -S $SQL_HOST -U sa -P "$SA_PASSWORD" -Q "SELECT 1" >/dev/null 2>&1; do
  sleep 2
done

echo "Restoring $DB_NAME from $BAK_PATH..."

$SQLCMD -S $SQL_HOST -U sa -P "$SA_PASSWORD" -Q "
IF DB_ID(N'$DB_NAME') IS NOT NULL
BEGIN
   ALTER DATABASE [$DB_NAME] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
END;
RESTORE DATABASE [$DB_NAME]
FROM DISK = N'$BAK_PATH'
WITH REPLACE,
     MOVE '$DB_NAME' TO '/var/opt/mssql/data/$DB_NAME.mdf',
     MOVE '${DB_NAME}_log' TO '/var/opt/mssql/data/${DB_NAME}_log.ldf';
IF DB_ID(N'$DB_NAME') IS NOT NULL
BEGIN
   ALTER DATABASE [$DB_NAME] SET MULTI_USER;
END;
"

echo "Restore complete."
