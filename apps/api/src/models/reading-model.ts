import type { Prisma, PrismaClient } from '@prisma/client';

import { getPrismaClient } from './prisma';

export type ReadingPassageListItem = {
  id: string;
  title: string;
  content: string;
  level: string;
  topic: string;
  estimatedMinutes: number;
  vocabularyWords: string[];
  progressPercent: number;
  bookmarked: boolean;
  lastReadAt: Date | null;
};

export async function listReadingPassages(
  userId: string,
  filters: {
    level?: string;
    topic?: string;
    search?: string;
    bookmarked?: boolean;
    count: number;
  },
  prisma: PrismaClient = getPrismaClient()
): Promise<ReadingPassageListItem[]> {
  const where: Prisma.ReadingPassageWhereInput = {};

  if (filters.level) {
    where.level = filters.level as Prisma.CefrLevel;
  }

  if (filters.topic) {
    where.topic = filters.topic;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  if (filters.bookmarked === true) {
    where.readingProgress = {
      some: {
        userId,
        bookmarked: true
      }
    };
  }

  const passages = await prisma.readingPassage.findMany({
    where,
    orderBy: [{ level: 'asc' }, { createdAt: 'desc' }],
    take: filters.count,
    include: {
      readingProgress: {
        where: { userId },
        select: { progressPercent: true, bookmarked: true, lastReadAt: true }
      }
    }
  });

  return passages.map((passage) => {
    const progress = passage.readingProgress[0];
    return {
      id: passage.id,
      title: passage.title,
      content: passage.content,
      level: passage.level,
      topic: passage.topic,
      estimatedMinutes: passage.estimatedMinutes,
      vocabularyWords: passage.vocabularyWords,
      progressPercent: progress?.progressPercent ?? 0,
      bookmarked: progress?.bookmarked ?? false,
      lastReadAt: progress?.lastReadAt ?? null
    };
  });
}

export async function getReadingPassageById(
  userId: string,
  passageId: string,
  prisma: PrismaClient = getPrismaClient()
): Promise<ReadingPassageListItem | null> {
  const passage = await prisma.readingPassage.findUnique({
    where: { id: passageId },
    include: {
      readingProgress: {
        where: { userId },
        select: { progressPercent: true, bookmarked: true, lastReadAt: true }
      }
    }
  });

  if (!passage) return null;

  const progress = passage.readingProgress[0];

  return {
    id: passage.id,
    title: passage.title,
    content: passage.content,
    level: passage.level,
    topic: passage.topic,
    estimatedMinutes: passage.estimatedMinutes,
    vocabularyWords: passage.vocabularyWords,
    progressPercent: progress?.progressPercent ?? 0,
    bookmarked: progress?.bookmarked ?? false,
    lastReadAt: progress?.lastReadAt ?? null
  };
}

export async function upsertReadingProgress(
  userId: string,
  passageId: string,
  progressPercent: number,
  prisma: PrismaClient = getPrismaClient()
): Promise<{ progressPercent: number; lastReadAt: Date }>{
  const updated = await prisma.readingProgress.upsert({
    where: { userId_passageId: { userId, passageId } },
    create: {
      userId,
      passageId,
      progressPercent,
      lastReadAt: new Date()
    },
    update: {
      progressPercent,
      lastReadAt: new Date()
    },
    select: { progressPercent: true, lastReadAt: true }
  });

  return {
    progressPercent: updated.progressPercent,
    lastReadAt: updated.lastReadAt ?? new Date()
  };
}

export async function setReadingBookmark(
  userId: string,
  passageId: string,
  bookmarked: boolean,
  prisma: PrismaClient = getPrismaClient()
): Promise<{ bookmarked: boolean }>{
  const updated = await prisma.readingProgress.upsert({
    where: { userId_passageId: { userId, passageId } },
    create: {
      userId,
      passageId,
      bookmarked
    },
    update: {
      bookmarked
    },
    select: { bookmarked: true }
  });

  return { bookmarked: updated.bookmarked };
}
