import type { CefrLevel, WordState } from '@vocabmaster/shared';

import {
  getDueReviewCount,
  getForgottenReviewQueue,
  getProgressStats,
  getReviewQueue,
  getSessionWords,
  getTargetLevel,
  setTargetLevel,
  updateWordState
} from '../services/learning-service';

export type LearningController = {
  getTargetLevel: (userId: string) => Promise<{ level: CefrLevel | null }>;
  setTargetLevel: (userId: string, level: CefrLevel) => Promise<{ level: CefrLevel }>;
  getSessionWords: (userId: string, count: number, topic?: string) => Promise<{
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
  }>;
  updateWordState: (userId: string, wordId: string, state: WordState) => Promise<{ wordId: string; state: WordState }>;
  getForgottenReviewQueue: (userId: string, count: number) => Promise<{
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
  }>;
  getProgressStats: (userId: string) => Promise<{ level: CefrLevel | null; totalTracked: number; known: number; learning: number; forgotten: number; dueReviewCount: number }>;
  getReviewQueue: (userId: string, count: number) => Promise<{
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
  }>;
  getDueReviewCount: (userId: string) => Promise<{ due: number }>;
};

export function createLearningController(controller: Partial<LearningController> = {}): LearningController {
  return {
    getTargetLevel: controller.getTargetLevel ?? getTargetLevel,
    setTargetLevel: controller.setTargetLevel ?? setTargetLevel,
    getSessionWords: controller.getSessionWords ?? getSessionWords,
    updateWordState: controller.updateWordState ?? updateWordState,
    getForgottenReviewQueue: controller.getForgottenReviewQueue ?? getForgottenReviewQueue,
    getProgressStats: controller.getProgressStats ?? getProgressStats,
    getReviewQueue: controller.getReviewQueue ?? getReviewQueue,
    getDueReviewCount: controller.getDueReviewCount ?? getDueReviewCount
  };
}
