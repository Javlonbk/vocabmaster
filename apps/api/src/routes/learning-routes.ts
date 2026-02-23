import { Router } from 'express';
import { z } from 'zod';

import { cefrLevelSchema, topicSchema, wordStateSchema } from '@vocabmaster/shared';
import type { CefrLevel, WordState } from '@vocabmaster/shared';
import { createLearningController, type LearningController } from '../controllers/learning-controller';
import { requireAuth } from '../middlewares/auth-middleware';
import { ApiError } from '../utils/errors';

const countSchema = z.coerce.number().int().min(1).max(60).default(20);

type LearningDeps = {
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

export function createLearningRouter(deps: LearningDeps): Router {
  const router = Router();

  router.use(requireAuth);

  router.get('/target-level', async (req, res) => {
    const result = await deps.getTargetLevel(req.userId!);
    res.status(200).json(result);
  });

  router.put('/target-level', async (req, res) => {
    const parse = z.object({ level: cefrLevelSchema }).safeParse(req.body);
    if (!parse.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parse.error.flatten());
    }

    const result = await deps.setTargetLevel(req.userId!, parse.data.level);
    res.status(200).json(result);
  });

  router.get('/session/words', async (req, res) => {
    const querySchema = z.object({
      count: countSchema,
      topic: topicSchema.optional()
    });
    const parsedQuery = querySchema.safeParse({
      count: req.query.count ?? 20,
      topic: req.query.topic
    });
    if (!parsedQuery.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parsedQuery.error.flatten());
    }
    const { count, topic } = parsedQuery.data;
    const result = await deps.getSessionWords(req.userId!, count, topic);
    res.status(200).json(result);
  });

  router.patch('/words/:wordId/state', async (req, res) => {
    const parse = z.object({ state: wordStateSchema }).safeParse(req.body);

    if (!parse.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parse.error.flatten());
    }

    const result = await deps.updateWordState(req.userId!, req.params.wordId, parse.data.state);
    res.status(200).json(result);
  });

  router.get('/review/forgotten', async (req, res) => {
    const parsedCount = countSchema.safeParse(req.query.count ?? 20);
    if (!parsedCount.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parsedCount.error.flatten());
    }
    const count = parsedCount.data;
    const result = await deps.getForgottenReviewQueue(req.userId!, count);
    res.status(200).json(result);
  });

  router.get('/review/queue', async (req, res) => {
    const parsedCount = countSchema.safeParse(req.query.count ?? 20);
    if (!parsedCount.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parsedCount.error.flatten());
    }
    const count = parsedCount.data;
    const result = await deps.getReviewQueue(req.userId!, count);
    res.status(200).json(result);
  });

  router.get('/review/due-count', async (req, res) => {
    const result = await deps.getDueReviewCount(req.userId!);
    res.status(200).json(result);
  });

  router.get('/progress', async (req, res) => {
    const result = await deps.getProgressStats(req.userId!);
    res.status(200).json(result);
  });

  return router;
}

function toRouteDeps(controller: LearningController): LearningDeps {
  return {
    getTargetLevel: controller.getTargetLevel,
    setTargetLevel: controller.setTargetLevel,
    getSessionWords: controller.getSessionWords,
    updateWordState: controller.updateWordState,
    getForgottenReviewQueue: controller.getForgottenReviewQueue,
    getProgressStats: controller.getProgressStats,
    getReviewQueue: controller.getReviewQueue,
    getDueReviewCount: controller.getDueReviewCount
  };
}

export const learningRouter = createLearningRouter(toRouteDeps(createLearningController()));
