import type { CefrLevel, WordState } from '@vocabmaster/shared';

import { getPrismaClient } from './prisma';

export async function findTargetLevel(userId: string): Promise<CefrLevel | null> {
  const prisma = getPrismaClient();
  const target = await prisma.levelTarget.findUnique({ where: { userId } });
  return (target?.level as CefrLevel | undefined) ?? null;
}

export async function upsertTargetLevel(userId: string, level: CefrLevel): Promise<CefrLevel> {
  const prisma = getPrismaClient();
  const target = await prisma.levelTarget.upsert({
    where: { userId },
    update: { level },
    create: { userId, level }
  });

  return target.level as CefrLevel;
}

export async function findSessionWordsByLevel(
  userId: string,
  level: CefrLevel,
  count: number,
  topic?: string
): Promise<
  Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    state: WordState | null;
  }>
> {
  const prisma = getPrismaClient();
  const words = await prisma.word.findMany({
    where: {
      level,
      ...(topic ? { topic } : {})
    },
    take: count,
    orderBy: { text: 'asc' },
    include: {
      wordStates: {
        where: { userId },
        select: { state: true }
      }
    }
  });

  const sessionWords: Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    state: WordState | null;
  }> = [];
  for (const word of words as Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    wordStates: Array<{ state: WordState }>;
  }>) {
    sessionWords.push({
      id: word.id,
      text: word.text,
      meaning: word.meaning,
      phonetic: word.phonetic,
      audio: word.audio,
      example: word.example,
      topic: word.topic,
      partOfSpeech: word.partOfSpeech,
      level: word.level,
      state: word.wordStates[0]?.state ?? null
    });
  }
  return sessionWords;
}

export async function findWordById(wordId: string): Promise<{ id: string } | null> {
  const prisma = getPrismaClient();
  const word = await prisma.word.findUnique({ where: { id: wordId }, select: { id: true } });
  return word ? { id: word.id } : null;
}

export async function findUserWordState(
  userId: string,
  wordId: string
): Promise<{ forgottenCount: number; repetitionInterval: number; easeFactor: number; reviewCount: number } | null> {
  const prisma = getPrismaClient();
  const state = await prisma.userWordState.findUnique({
    where: { userId_wordId: { userId, wordId } },
    select: { forgottenCount: true, repetitionInterval: true, easeFactor: true, reviewCount: true }
  });

  return state
    ? {
        forgottenCount: state.forgottenCount,
        repetitionInterval: state.repetitionInterval,
        easeFactor: state.easeFactor,
        reviewCount: state.reviewCount
      }
    : null;
}

export async function upsertUserWordState(
  userId: string,
  wordId: string,
  state: WordState,
  forgottenCount: number,
  repetitionInterval: number,
  easeFactor: number,
  nextReviewAt: Date
): Promise<void> {
  const prisma = getPrismaClient();
  await prisma.userWordState.upsert({
    where: { userId_wordId: { userId, wordId } },
    update: {
      state,
      reviewCount: { increment: 1 },
      forgottenCount,
      lastReviewedAt: new Date(),
      repetitionInterval,
      easeFactor,
      nextReviewAt
    },
    create: {
      userId,
      wordId,
      state,
      reviewCount: 1,
      forgottenCount: state === 'Forgotten' ? 1 : 0,
      lastReviewedAt: new Date(),
      repetitionInterval,
      easeFactor,
      nextReviewAt
    }
  });
}

export async function findReviewQueue(
  userId: string,
  count: number
): Promise<
  Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    nextReviewAt: Date | null;
  }>
> {
  const prisma = getPrismaClient();
  const states = await prisma.userWordState.findMany({
    where: {
      userId,
      nextReviewAt: { lte: new Date() }
    },
    take: count,
    orderBy: [{ nextReviewAt: 'asc' }, { updatedAt: 'asc' }],
    include: { word: true }
  });

  const queue: Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    nextReviewAt: Date | null;
  }> = [];
  for (const item of states as Array<{
    nextReviewAt: Date | null;
    word: {
      id: string;
      text: string;
      meaning: string;
      phonetic: string;
      audio: string;
      example: string;
      topic: string;
      partOfSpeech: string;
      level: CefrLevel;
    };
  }>) {
    queue.push({
      id: item.word.id,
      text: item.word.text,
      meaning: item.word.meaning,
      phonetic: item.word.phonetic,
      audio: item.word.audio,
      example: item.word.example,
      topic: item.word.topic,
      partOfSpeech: item.word.partOfSpeech,
      level: item.word.level,
      nextReviewAt: item.nextReviewAt
    });
  }
  return queue;
}

export async function countDueReviews(userId: string): Promise<number> {
  const prisma = getPrismaClient();
  return prisma.userWordState.count({
    where: {
      userId,
      nextReviewAt: { lte: new Date() }
    }
  });
}

export async function findForgottenReviewQueue(
  userId: string,
  count: number
): Promise<
  Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    lastReviewedAt: Date | null;
  }>
> {
  const prisma = getPrismaClient();
  const states = await prisma.userWordState.findMany({
    where: { userId, state: 'Forgotten' },
    take: count,
    orderBy: [{ lastReviewedAt: 'asc' }, { updatedAt: 'asc' }],
    include: { word: true }
  });

  const forgottenWords: Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    lastReviewedAt: Date | null;
  }> = [];
  for (const item of states as Array<{
    lastReviewedAt: Date | null;
    word: { id: string; text: string; meaning: string; phonetic: string; audio: string; example: string; topic: string; partOfSpeech: string; level: CefrLevel };
  }>) {
    forgottenWords.push({
      id: item.word.id,
      text: item.word.text,
      meaning: item.word.meaning,
      phonetic: item.word.phonetic,
      audio: item.word.audio,
      example: item.word.example,
      topic: item.word.topic,
      partOfSpeech: item.word.partOfSpeech,
      level: item.word.level,
      lastReviewedAt: item.lastReviewedAt
    });
  }
  return forgottenWords;
}

export async function findProgressCounts(userId: string): Promise<Array<{ state: WordState; count: number }>> {
  const prisma = getPrismaClient();
  const grouped = await prisma.userWordState.groupBy({
    by: ['state'],
    where: { userId },
    _count: { state: true }
  });

  const counts: Array<{ state: WordState; count: number }> = [];
  for (const bucket of grouped as Array<{ state: WordState; _count: { state: number } }>) {
    counts.push({
      state: bucket.state,
      count: bucket._count.state
    });
  }
  return counts;
}
