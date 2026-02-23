-- CreateTable
CREATE TABLE "reading_passages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "level" "CefrLevel" NOT NULL,
    "topic" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "vocabularyWords" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_passages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passageId" TEXT NOT NULL,
    "progressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "lastReadAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reading_passages_level_idx" ON "reading_passages"("level");

-- CreateIndex
CREATE INDEX "reading_passages_topic_idx" ON "reading_passages"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "reading_progress_userId_passageId_key" ON "reading_progress"("userId", "passageId");

-- CreateIndex
CREATE INDEX "reading_progress_userId_bookmarked_idx" ON "reading_progress"("userId", "bookmarked");

-- AddForeignKey
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "reading_passages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
