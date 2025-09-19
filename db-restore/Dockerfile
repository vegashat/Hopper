FROM mcr.microsoft.com/mssql-tools:latest

WORKDIR /scripts

COPY restore.sh .

ENTRYPOINT ["./restore.sh"]