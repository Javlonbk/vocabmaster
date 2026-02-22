import type { CefrLevel } from '@vocabmaster/shared';

import {
  getReadingPassage,
  getReadingPassages,
  markReadingWordLearned,
  updateReadingBookmark,
  updateReadingProgress
} from '../services/reading-service';

export type ReadingController = {
  getReadingPassages: (userId: string, filters: { level?: CefrLevel; topic?: string; search?: string; bookmarked?: boolean; count: number }) => Promise<{
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
  }>;
  getReadingPassage: (userId: string, passageId: string) => Promise<{
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
  }>;
  updateReadingProgress: (userId: string, passageId: string, progressPercent: number) => Promise<{ progressPercent: number; lastReadAt: string }>;
  updateReadingBookmark: (userId: string, passageId: string, bookmarked: boolean) => Promise<{ bookmarked: boolean }>;
  markReadingWordLearned: (userId: string, wordId: string) => Promise<{ wordId: string; state: 'Known' }>;
};

export function createReadingController(controller: Partial<ReadingController> = {}): ReadingController {
  return {
    getReadingPassages: controller.getReadingPassages ?? getReadingPassages,
    getReadingPassage: controller.getReadingPassage ?? getReadingPassage,
    updateReadingProgress: controller.updateReadingProgress ?? updateReadingProgress,
    updateReadingBookmark: controller.updateReadingBookmark ?? updateReadingBookmark,
    markReadingWordLearned: controller.markReadingWordLearned ?? markReadingWordLearned
  };
}
