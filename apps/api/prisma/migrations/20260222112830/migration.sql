DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'phonetic'
  ) THEN
    ALTER TABLE "words" ALTER COLUMN "phonetic" DROP DEFAULT;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'audio'
  ) THEN
    ALTER TABLE "words" ALTER COLUMN "audio" DROP DEFAULT;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'example'
  ) THEN
    ALTER TABLE "words" ALTER COLUMN "example" DROP DEFAULT;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'topic'
  ) THEN
    ALTER TABLE "words" ALTER COLUMN "topic" DROP DEFAULT;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'partOfSpeech'
  ) THEN
    ALTER TABLE "words" ALTER COLUMN "partOfSpeech" DROP DEFAULT;
  END IF;
END $$;
