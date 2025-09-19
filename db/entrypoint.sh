#!/bin/bash
set -e

/usr/local/bin/restore.sh &

/opt/mssql/bin/sqlservr
