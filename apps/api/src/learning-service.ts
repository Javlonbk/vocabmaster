import type { CefrLevel, WordState } from '@prisma/client';

import { ApiError } from './errors';
import { prisma } from './prisma';

export async function getTargetLevel(userId: string): Promise<{ level: CefrLevel | null }> {
  const target = await prisma.levelTarget.findUnique({ where: { userId } });
  return { level: target?.level ?? null };
}

export async function setTargetLevel(userId: string, level: CefrLevel): Promise<{ level: CefrLevel }> {
  const target = await prisma.levelTarget.upsert({
    where: { userId },
    update: { level },
    create: { userId, level }
  });

  return { level: target.level };
}

export async function getSessionWords(userId: string, count: number): Promise<{ words: Array<{ id: string; text: string; meaning: string; level: CefrLevel; state: WordState | null }> }> {
  const target = await prisma.levelTarget.findUnique({ where: { userId } });

  if (!target) {
    throw new ApiError(400, 'LEVEL_NOT_SET', 'Target level must be selected first');
  }

  const words = await prisma.word.findMany({
    where: { level: target.level },
    take: count,
    orderBy: { text: 'asc' },
    include: {
      wordStates: {
        where: { userId },
        select: { state: true }
      }
    }
  });

  return {
    words: words.map((word) => ({
      id: word.id,
      text: word.text,
      meaning: word.meaning,
      level: word.level,
      state: word.wordStates[0]?.state ?? null
    }))
  };
}

export async function updateWordState(userId: string, wordId: string, state: WordState): Promise<{ wordId: string; state: WordState }> {
  const existingWord = await prisma.word.findUnique({ where: { id: wordId } });

  if (!existingWord) {
    throw new ApiError(404, 'WORD_NOT_FOUND', 'Word not found');
  }

  const existingState = await prisma.userWordState.findUnique({
    where: { userId_wordId: { userId, wordId } }
  });

  const nextForgottenCount = state === 'Forgotten' ? (existingState?.forgottenCount ?? 0) + 1 : existingState?.forgottenCount ?? 0;

  await prisma.userWordState.upsert({
    where: { userId_wordId: { userId, wordId } },
    update: {
      state,
      reviewCount: { increment: 1 },
      forgottenCount: nextForgottenCount,
      lastReviewedAt: new Date()
    },
    create: {
      userId,
      wordId,
      state,
      reviewCount: 1,
      forgottenCount: state === 'Forgotten' ? 1 : 0,
      lastReviewedAt: new Date()
    }
  });

  return { wordId, state };
}

export async function getForgottenReviewQueue(userId: string, count: number): Promise<{ words: Array<{ id: string; text: string; meaning: string; level: CefrLevel; lastReviewedAt: string | null }> }> {
  const states = await prisma.userWordState.findMany({
    where: { userId, state: 'Forgotten' },
    take: count,
    orderBy: [{ lastReviewedAt: 'asc' }, { updatedAt: 'asc' }],
    include: { word: true }
  });

  return {
    words: states.map((item) => ({
      id: item.word.id,
      text: item.word.text,
      meaning: item.word.meaning,
      level: item.word.level,
      lastReviewedAt: item.lastReviewedAt ? item.lastReviewedAt.toISOString() : null
    }))
  };
}

export async function getProgressStats(userId: string): Promise<{
  level: CefrLevel | null;
  totalTracked: number;
  known: number;
  learning: number;
  forgotten: number;
}> {
  const target = await prisma.levelTarget.findUnique({ where: { userId } });

  const grouped = await prisma.userWordState.groupBy({
    by: ['state'],
    where: { userId },
    _count: { state: true }
  });

  const known = grouped.find((x) => x.state === 'Known')?._count.state ?? 0;
  const learning = grouped.find((x) => x.state === 'Learning')?._count.state ?? 0;
  const forgotten = grouped.find((x) => x.state === 'Forgotten')?._count.state ?? 0;

  return {
    level: target?.level ?? null,
    totalTracked: known + learning + forgotten,
    known,
    learning,
    forgotten
  };
}
