ALTER TABLE "words" ADD COLUMN "frequency" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "words_text_idx" ON "words"("text");
CREATE INDEX "words_topic_idx" ON "words"("topic");
CREATE INDEX "words_partOfSpeech_idx" ON "words"("partOfSpeech");
