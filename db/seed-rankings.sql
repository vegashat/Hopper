/*
    Test data for automatic ranked picks.

    Change the values below as needed, then run this script against Hopper.
    The script replaces rankings for every participant with an allotment in the
    selected season. It does not start the draft.
*/
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @SeasonId int = 1;
DECLARE @RankedGameCount int = 5;

IF OBJECT_ID(N'dbo.GameRanking', N'U') IS NULL
    THROW 50000, 'Run db/migrate.sql before seeding game rankings.', 1;

IF EXISTS (
    SELECT 1
    FROM dbo.Draft
    WHERE SeasonId = @SeasonId
      AND IsActive = 1
)
    THROW 50001, 'Reset the active draft before seeding rankings.', 1;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.ParticipantAllotment
    WHERE SeasonId = @SeasonId
      AND TicketAllotment > 0
)
    THROW 50002, 'No participants have a ticket allotment for this season.', 1;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.Game
    WHERE SeasonId = @SeasonId
)
    THROW 50003, 'No games exist for this season.', 1;

BEGIN TRANSACTION;

DELETE FROM dbo.GameRanking
WHERE SeasonId = @SeasonId;

;WITH RankedGames AS
(
    SELECT
        GameId,
        ROW_NUMBER() OVER (ORDER BY GameDateTime, GameId) AS RankOrder
    FROM dbo.Game
    WHERE SeasonId = @SeasonId
),
Participants AS
(
    SELECT FirebaseUserId
    FROM dbo.ParticipantAllotment
    WHERE SeasonId = @SeasonId
      AND TicketAllotment > 0
)
INSERT INTO dbo.GameRanking
(
    SeasonId,
    FirebaseUserId,
    GameId,
    RankOrder,
    Quantity,
    IsFulfilled
)
SELECT
    @SeasonId,
    participant.FirebaseUserId,
    game.GameId,
    game.RankOrder,
    CASE WHEN game.RankOrder % 3 = 0 THEN 4 ELSE 2 END,
    0
FROM Participants participant
CROSS JOIN RankedGames game
WHERE game.RankOrder <= @RankedGameCount;

COMMIT TRANSACTION;

SELECT
    ranking.FirebaseUserId,
    ranking.RankOrder,
    ranking.GameId,
    game.GameDateTime,
    ranking.Quantity,
    ranking.IsFulfilled
FROM dbo.GameRanking ranking
INNER JOIN dbo.Game game ON game.GameId = ranking.GameId
WHERE ranking.SeasonId = @SeasonId
ORDER BY ranking.FirebaseUserId, ranking.RankOrder;
