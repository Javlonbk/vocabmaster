import type { CefrLevel } from '@vocabmaster/shared';

import { ApiError } from '../utils/errors';
import { getPrismaClient } from '../models/prisma';
import { updateWordState } from './learning-service';
import { getReadingPassageById, listReadingPassages, setReadingBookmark, upsertReadingProgress } from '../models/reading-model';

export async function getReadingPassages(
  userId: string,
  filters: { level?: CefrLevel; topic?: string; search?: string; bookmarked?: boolean; count: number }
): Promise<{
  passages: Array<{
    id: string;
    title: string;
    level: CefrLevel;
    topic: string;
    estimatedMinutes: number;
    vocabularyCount: number;
    progressPercent: number;
    bookmarked: boolean;
    lastReadAt: string | null;
  }>;
}> {
  const passages = await listReadingPassages(userId, filters);

  return {
    passages: passages.map((passage) => ({
      id: passage.id,
      title: passage.title,
      level: passage.level as CefrLevel,
      topic: passage.topic,
      estimatedMinutes: passage.estimatedMinutes,
      vocabularyCount: passage.vocabularyWords.length,
      progressPercent: passage.progressPercent,
      bookmarked: passage.bookmarked,
      lastReadAt: passage.lastReadAt ? passage.lastReadAt.toISOString() : null
    }))
  };
}

export async function getReadingPassage(
  userId: string,
  passageId: string
): Promise<{
  id: string;
  title: string;
  content: string;
  level: CefrLevel;
  topic: string;
  estimatedMinutes: number;
  vocabulary: Array<{
    id: string;
    text: string;
    meaning: string;
    phonetic: string;
    audio: string;
    example: string;
    topic: string;
    partOfSpeech: string;
    level: CefrLevel;
  }>;
  progressPercent: number;
  bookmarked: boolean;
  lastReadAt: string | null;
}> {
  const passage = await getReadingPassageById(userId, passageId);

  if (!passage) {
    throw new ApiError(404, 'NOT_FOUND', 'Reading passage not found');
  }

  const prisma = getPrismaClient();
  const words = await prisma.word.findMany({
    where: {
      text: { in: passage.vocabularyWords }
    }
  });

  const wordMap = new Map(words.map((word) => [word.text.toLowerCase(), word]));
  const orderedWords = passage.vocabularyWords
    .map((text) => wordMap.get(text.toLowerCase()))
    .filter((word): word is (typeof words)[number] => Boolean(word));

  return {
    id: passage.id,
    title: passage.title,
    content: passage.content,
    level: passage.level as CefrLevel,
    topic: passage.topic,
    estimatedMinutes: passage.estimatedMinutes,
    vocabulary: orderedWords.map((word) => ({
      id: word.id,
      text: word.text,
      meaning: word.meaning,
      phonetic: word.phonetic,
      audio: word.audio,
      example: word.example,
      topic: word.topic,
      partOfSpeech: word.partOfSpeech,
      level: word.level as CefrLevel
    })),
    progressPercent: passage.progressPercent,
    bookmarked: passage.bookmarked,
    lastReadAt: passage.lastReadAt ? passage.lastReadAt.toISOString() : null
  };
}

export async function updateReadingProgress(
  userId: string,
  passageId: string,
  progressPercent: number
): Promise<{ progressPercent: number; lastReadAt: string }>{
  const updated = await upsertReadingProgress(userId, passageId, progressPercent);
  return {
    progressPercent: updated.progressPercent,
    lastReadAt: updated.lastReadAt.toISOString()
  };
}

export async function updateReadingBookmark(
  userId: string,
  passageId: string,
  bookmarked: boolean
): Promise<{ bookmarked: boolean }>{
  return setReadingBookmark(userId, passageId, bookmarked);
}

export async function markReadingWordLearned(userId: string, wordId: string): Promise<{ wordId: string; state: 'Known' }>{
  const result = await updateWordState(userId, wordId, 'Known');
  return { wordId: result.wordId, state: 'Known' };
}
