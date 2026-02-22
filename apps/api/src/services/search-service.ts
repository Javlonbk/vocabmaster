import type { CefrLevel, WordState } from '@vocabmaster/shared';
import { cefrLevelSchema, partOfSpeechSchema, topicSchema } from '@vocabmaster/shared';

import type { Prisma, PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../models/prisma';
import { calculateAccuracy, classifyMastery, type MasteryLabel } from '../utils/search-utils';

export type SearchStateFilter = WordState | 'NotStarted';
export type SearchSort =
  | 'alphabetical_asc'
  | 'alphabetical_desc'
  | 'level_asc'
  | 'level_desc'
  | 'learned_desc'
  | 'learned_asc'
  | 'frequency_desc'
  | 'frequency_asc'
  | 'accuracy_desc'
  | 'accuracy_asc';

export type SearchFilters = {
  query?: string;
  levels?: CefrLevel[];
  topics?: string[];
  partsOfSpeech?: string[];
  states?: SearchStateFilter[];
  mastery?: MasteryLabel[];
  sort: SearchSort;
  page: number;
  count: number;
};

export type SearchResultWord = {
  id: string;
  text: string;
  meaning: string;
  phonetic: string;
  audio: string;
  example: string;
  topic: string;
  partOfSpeech: string;
  level: CefrLevel;
  frequency: number;
  state: WordState | null;
  reviewCount: number;
  forgottenCount: number;
  accuracy: number;
  mastery: MasteryLabel;
  lastReviewedAt: string | null;
  learnedAt: string | null;
};

const levelRank: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6
};

function compareValues<T>(a: T, b: T, direction: 'asc' | 'desc'): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return direction === 'asc' ? 1 : -1;
  if (b === null || b === undefined) return direction === 'asc' ? -1 : 1;
  return a > b ? (direction === 'asc' ? 1 : -1) : (direction === 'asc' ? -1 : 1);
}

export async function searchWords(
  userId: string,
  filters: SearchFilters,
  prisma: PrismaClient = getPrismaClient()
): Promise<{ results: SearchResultWord[]; total: number; page: number; count: number; hasMore: boolean }>{
  const andConditions: Prisma.WordWhereInput[] = [];

  if (filters.query) {
    andConditions.push({
      OR: [
        { text: { contains: filters.query, mode: 'insensitive' } },
        { meaning: { contains: filters.query, mode: 'insensitive' } },
        { example: { contains: filters.query, mode: 'insensitive' } }
      ]
    });
  }

  if (filters.levels && filters.levels.length > 0) {
    andConditions.push({ level: { in: filters.levels } });
  }

  if (filters.topics && filters.topics.length > 0) {
    andConditions.push({ topic: { in: filters.topics } });
  }

  if (filters.partsOfSpeech && filters.partsOfSpeech.length > 0) {
    andConditions.push({ partOfSpeech: { in: filters.partsOfSpeech } });
  }

  if (filters.states && filters.states.length > 0) {
    const includeNotStarted = filters.states.includes('NotStarted');
    const stateFilters = filters.states.filter((state) => state !== 'NotStarted') as WordState[];

    if (includeNotStarted && stateFilters.length > 0) {
      andConditions.push({
        OR: [
          { wordStates: { some: { userId, state: { in: stateFilters } } } },
          { wordStates: { none: { userId } } }
        ]
      });
    } else if (includeNotStarted) {
      andConditions.push({ wordStates: { none: { userId } } });
    } else {
      andConditions.push({ wordStates: { some: { userId, state: { in: stateFilters } } } });
    }
  }

  const where: Prisma.WordWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const words = await prisma.word.findMany({
    where,
    include: {
      wordStates: {
        where: { userId },
        select: {
          state: true,
          reviewCount: true,
          forgottenCount: true,
          lastReviewedAt: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });

  let results = words.map((word) => {
    const state = word.wordStates[0] ?? null;
    const reviewCount = state?.reviewCount ?? 0;
    const forgottenCount = state?.forgottenCount ?? 0;
    const accuracy = calculateAccuracy(reviewCount, forgottenCount);
    const mastery = classifyMastery(state?.state ?? null, reviewCount, forgottenCount);
    const learnedAt = state?.lastReviewedAt ?? state?.updatedAt ?? state?.createdAt ?? null;

    return {
      id: word.id,
      text: word.text,
      meaning: word.meaning,
      phonetic: word.phonetic,
      audio: word.audio,
      example: word.example,
      topic: word.topic,
      partOfSpeech: word.partOfSpeech,
      level: word.level as CefrLevel,
      frequency: word.frequency ?? 0,
      state: state?.state ?? null,
      reviewCount,
      forgottenCount,
      accuracy,
      mastery,
      lastReviewedAt: state?.lastReviewedAt ? state.lastReviewedAt.toISOString() : null,
      learnedAt: learnedAt ? learnedAt.toISOString() : null
    };
  });

  if (filters.mastery && filters.mastery.length > 0) {
    results = results.filter((word) => filters.mastery!.includes(word.mastery));
  }

  results.sort((a, b) => {
    switch (filters.sort) {
      case 'alphabetical_asc':
        return compareValues(a.text, b.text, 'asc');
      case 'alphabetical_desc':
        return compareValues(a.text, b.text, 'desc');
      case 'level_asc':
        return compareValues(levelRank[a.level], levelRank[b.level], 'asc');
      case 'level_desc':
        return compareValues(levelRank[a.level], levelRank[b.level], 'desc');
      case 'learned_desc':
        return compareValues(a.learnedAt, b.learnedAt, 'desc');
      case 'learned_asc':
        return compareValues(a.learnedAt, b.learnedAt, 'asc');
      case 'frequency_desc':
        return compareValues(a.frequency, b.frequency, 'desc');
      case 'frequency_asc':
        return compareValues(a.frequency, b.frequency, 'asc');
      case 'accuracy_desc':
        return compareValues(a.accuracy, b.accuracy, 'desc');
      case 'accuracy_asc':
        return compareValues(a.accuracy, b.accuracy, 'asc');
      default:
        return 0;
    }
  });

  const total = results.length;
  const start = (filters.page - 1) * filters.count;
  const end = start + filters.count;
  const paged = results.slice(start, end);

  return {
    results: paged,
    total,
    page: filters.page,
    count: filters.count,
    hasMore: end < total
  };
}

export function getSearchFilterOptions(): {
  levels: CefrLevel[];
  topics: string[];
  partsOfSpeech: string[];
  states: SearchStateFilter[];
  mastery: MasteryLabel[];
  sortOptions: SearchSort[];
} {
  return {
    levels: cefrLevelSchema.options,
    topics: topicSchema.options,
    partsOfSpeech: partOfSpeechSchema.options,
    states: ['Known', 'Learning', 'Forgotten', 'NotStarted'],
    mastery: ['Mastered', 'InProgress', 'Struggling', 'NotStarted'],
    sortOptions: [
      'alphabetical_asc',
      'alphabetical_desc',
      'level_asc',
      'level_desc',
      'learned_desc',
      'learned_asc',
      'frequency_desc',
      'frequency_asc',
      'accuracy_desc',
      'accuracy_asc'
    ]
  };
}
