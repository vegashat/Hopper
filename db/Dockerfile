FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
COPY ./restore.sh /usr/local/bin/restore.sh

RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/restore.sh \
    && mkdir -p /var/opt/sqlserver/backup /var/opt/sqlserver/data /var/opt/sqlserver/log

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
