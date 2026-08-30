SET NOCOUNT ON;

IF OBJECT_ID(N'dbo.Participant', N'U') IS NOT NULL
   AND COL_LENGTH(N'dbo.Participant', N'Pin') < 400
BEGIN
    ALTER TABLE dbo.Participant ALTER COLUMN Pin nvarchar(200) NULL;
END;
