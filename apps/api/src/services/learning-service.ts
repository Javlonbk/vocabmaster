import type { CefrLevel, WordState } from '@vocabmaster/shared';

import {
  countDueReviews,
  findReviewQueue,
  findForgottenReviewQueue,
  findProgressCounts,
  findSessionWordsByLevel,
  findTargetLevel,
  findUserWordState,
  findWordById,
  upsertTargetLevel,
  upsertUserWordState
} from '../models/learning-model';
import { ApiError } from '../utils/errors';
import { calculateNextReview } from '../utils/spaced-repetition';

export async function getTargetLevel(userId: string): Promise<{ level: CefrLevel | null }> {
  const level = await findTargetLevel(userId);
  return { level };
}

export async function setTargetLevel(userId: string, level: CefrLevel): Promise<{ level: CefrLevel }> {
  const savedLevel = await upsertTargetLevel(userId, level);
  return { level: savedLevel };
}

export async function getSessionWords(
  userId: string,
  count: number,
  topic?: string
): Promise<{
  words: Array<{
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
  }>;
}> {
  const level = await findTargetLevel(userId);
  if (!level) {
    throw new ApiError(400, 'LEVEL_NOT_SET', 'Target level must be selected first');
  }

  const words = await findSessionWordsByLevel(userId, level, count, topic);
  return { words };
}

export async function updateWordState(userId: string, wordId: string, state: WordState): Promise<{ wordId: string; state: WordState }> {
  const word = await findWordById(wordId);
  if (!word) {
    throw new ApiError(404, 'WORD_NOT_FOUND', 'Word not found');
  }

  const existingState = await findUserWordState(userId, wordId);
  const forgottenCount = state === 'Forgotten' ? (existingState?.forgottenCount ?? 0) + 1 : existingState?.forgottenCount ?? 0;
  const schedule = calculateNextReview({
    state,
    currentInterval: existingState?.repetitionInterval,
    currentEase: existingState?.easeFactor
  });

  await upsertUserWordState(
    userId,
    wordId,
    state,
    forgottenCount,
    schedule.repetitionInterval,
    schedule.easeFactor,
    schedule.nextReviewAt
  );

  return { wordId, state };
}

export async function getForgottenReviewQueue(
  userId: string,
  count: number
): Promise<{
  words: Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    lastReviewedAt: string | null;
  }>;
}> {
  const words = await findForgottenReviewQueue(userId, count);
  return {
    words: words.map((word) => ({
      id: word.id,
      text: word.text,
      meaning: word.meaning,
      phonetic: word.phonetic,
      audio: word.audio,
      example: word.example,
      topic: word.topic,
      partOfSpeech: word.partOfSpeech,
      level: word.level,
      lastReviewedAt: word.lastReviewedAt ? word.lastReviewedAt.toISOString() : null
    }))
  };
}

export async function getProgressStats(userId: string): Promise<{
  level: CefrLevel | null;
  totalTracked: number;
  known: number;
  learning: number;
  forgotten: number;
  dueReviewCount: number;
}> {
  const level = await findTargetLevel(userId);
  const grouped = await findProgressCounts(userId);
  const dueReviewCount = await countDueReviews(userId);

  let known = 0;
  let learning = 0;
  let forgotten = 0;

  for (const bucket of grouped) {
    if (bucket.state === 'Known') known = bucket.count;
    if (bucket.state === 'Learning') learning = bucket.count;
    if (bucket.state === 'Forgotten') forgotten = bucket.count;
  }

  return {
    level,
    totalTracked: known + learning + forgotten,
    known,
    learning,
    forgotten,
    dueReviewCount
  };
}

export async function getReviewQueue(
  userId: string,
  count: number
): Promise<{
  words: Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
    nextReviewAt: string | null;
  }>;
}> {
  const words = await findReviewQueue(userId, count);
  return {
    words: words.map((word) => ({
      id: word.id,
      text: word.text,
      meaning: word.meaning,
      phonetic: word.phonetic,
      audio: word.audio,
      example: word.example,
      topic: word.topic,
      partOfSpeech: word.partOfSpeech,
      level: word.level,
      nextReviewAt: word.nextReviewAt ? word.nextReviewAt.toISOString() : null
    }))
  };
}

export async function getDueReviewCount(userId: string): Promise<{ due: number }> {
  const due = await countDueReviews(userId);
  return { due };
}
