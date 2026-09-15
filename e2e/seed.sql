SET NOCOUNT ON;
IF DB_NAME() <> 'HopperE2e' THROW 50000, 'Fixture requires HopperE2e database', 1;
BEGIN TRANSACTION;
DELETE FROM GameRanking;
DELETE FROM Selection;
DELETE FROM DraftPick;
DELETE FROM Draft;
DELETE FROM ParticipantAllotment;
DELETE FROM Game;
DELETE FROM Participant;
INSERT INTO Participant (FirebaseUserId, DisplayName, IsAdmin, CreatedUtc)
VALUES ('e2e-admin', 'E2E Admin', 1, SYSUTCDATETIME()),
       ('e2e-a', 'E2E Alice', 0, SYSUTCDATETIME()),
       ('e2e-b', 'E2E Bob', 0, SYSUTCDATETIME()),
       ('e2e-c', 'E2E Carol', 0, SYSUTCDATETIME());
INSERT INTO ParticipantAllotment (FirebaseUserId, SeasonId, TicketAllotment)
VALUES ('e2e-admin', 1, 0), ('e2e-a', 1, 8), ('e2e-b', 1, 8), ('e2e-c', 1, 8);
INSERT INTO Game (SeasonId, OpponentTeamId, GameDateTime, Arena, RemainingTickets)
SELECT TOP (6) 1, TeamId, DATEADD(day, ROW_NUMBER() OVER (ORDER BY TeamId), CAST('2027-01-01T19:00:00-06:00' AS datetimeoffset)), 'E2E Arena', 4
FROM Team ORDER BY TeamId;
IF (SELECT COUNT(*) FROM Game) <> 6 THROW 50000, 'Expected six fixture games', 1;
COMMIT;
