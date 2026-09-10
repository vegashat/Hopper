SET NOCOUNT ON;

IF OBJECT_ID(N'dbo.Participant', N'U') IS NOT NULL
   AND COL_LENGTH(N'dbo.Participant', N'Pin') < 400
BEGIN
    ALTER TABLE dbo.Participant ALTER COLUMN Pin nvarchar(200) NULL;
END;

IF OBJECT_ID(N'dbo.GameRanking', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.GameRanking
    (
        GameRankingId bigint IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_GameRanking PRIMARY KEY,
        SeasonId int NOT NULL,
        FirebaseUserId nvarchar(128) NOT NULL,
        GameId int NOT NULL,
        RankOrder int NOT NULL,
        Quantity tinyint NOT NULL,
        IsFulfilled bit NOT NULL CONSTRAINT DF_GameRanking_IsFulfilled DEFAULT (0),
        CONSTRAINT CK_GameRanking_RankOrder CHECK (RankOrder > 0),
        CONSTRAINT CK_GameRanking_Quantity CHECK (Quantity IN (2, 4)),
        CONSTRAINT UQ_GameRanking_UserGame UNIQUE (SeasonId, FirebaseUserId, GameId),
        CONSTRAINT UQ_GameRanking_UserRank UNIQUE (SeasonId, FirebaseUserId, RankOrder)
    );

    CREATE INDEX IX_GameRanking_AutomaticPick
        ON dbo.GameRanking (SeasonId, FirebaseUserId, RankOrder)
        INCLUDE (GameId, Quantity);
END;

IF OBJECT_ID(N'dbo.GameRanking', N'U') IS NOT NULL
   AND COL_LENGTH(N'dbo.GameRanking', N'IsFulfilled') IS NULL
BEGIN
    ALTER TABLE dbo.GameRanking
        ADD IsFulfilled bit NOT NULL
            CONSTRAINT DF_GameRanking_IsFulfilled DEFAULT (0);
END;

IF COL_LENGTH(N'dbo.Participant', N'PinResetUsed') IS NULL
    ALTER TABLE dbo.Participant ADD PinResetUsed bit NOT NULL CONSTRAINT DF_Participant_PinResetUsed DEFAULT (0);
IF COL_LENGTH(N'dbo.Participant', N'SessionVersion') IS NULL
    ALTER TABLE dbo.Participant ADD SessionVersion int NOT NULL CONSTRAINT DF_Participant_SessionVersion DEFAULT (0);

IF OBJECT_ID(N'dbo.StevenCounter', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.StevenCounter (
        Id int NOT NULL PRIMARY KEY CHECK (Id = 1),
        Enabled bit NOT NULL DEFAULT (0),
        StevenId nvarchar(128) NULL,
        Total bigint NOT NULL DEFAULT (0)
    );
    INSERT INTO dbo.StevenCounter (Id) VALUES (1);
END;
IF OBJECT_ID(N'dbo.StevenCounterCooldown', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.StevenCounterCooldown (
        FirebaseUserId nvarchar(128) NOT NULL PRIMARY KEY,
        NextClickUtc datetime2 NOT NULL
    );
END;
