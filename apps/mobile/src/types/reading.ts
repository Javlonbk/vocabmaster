import type { CefrLevel } from './shared';

export type ReadingPassageSummary = {
  id: string;
  title: string;
  level: CefrLevel;
  topic: string;
  estimatedMinutes: number;
  vocabularyCount: number;
  progressPercent: number;
  bookmarked: boolean;
  lastReadAt: string | null;
};

export type ReadingWord = {
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

export type ReadingPassageDetail = {
  id: string;
  title: string;
  content: string;
  level: CefrLevel;
  topic: string;
  estimatedMinutes: number;
  vocabulary: ReadingWord[];
  progressPercent: number;
  bookmarked: boolean;
  lastReadAt: string | null;
};
