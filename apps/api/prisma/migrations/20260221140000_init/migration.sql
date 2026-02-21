-- CreateEnum
CREATE TYPE "CefrLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "WordState" AS ENUM ('Known', 'Learning', 'Forgotten');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_targets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "CefrLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "level" "CefrLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_word_states" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "state" "WordState" NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "forgottenCount" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_word_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "level_targets_userId_key" ON "level_targets"("userId");

-- CreateIndex
CREATE INDEX "level_targets_level_idx" ON "level_targets"("level");

-- CreateIndex
CREATE UNIQUE INDEX "words_text_level_key" ON "words"("text", "level");

-- CreateIndex
CREATE INDEX "words_level_idx" ON "words"("level");

-- CreateIndex
CREATE UNIQUE INDEX "user_word_states_userId_wordId_key" ON "user_word_states"("userId", "wordId");

-- CreateIndex
CREATE INDEX "user_word_states_userId_state_lastReviewedAt_idx" ON "user_word_states"("userId", "state", "lastReviewedAt");

-- CreateIndex
CREATE INDEX "user_word_states_userId_state_nextReviewAt_idx" ON "user_word_states"("userId", "state", "nextReviewAt");

-- CreateIndex
CREATE INDEX "user_word_states_wordId_idx" ON "user_word_states"("wordId");

-- AddForeignKey
ALTER TABLE "level_targets" ADD CONSTRAINT "level_targets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word_states" ADD CONSTRAINT "user_word_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word_states" ADD CONSTRAINT "user_word_states_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;
