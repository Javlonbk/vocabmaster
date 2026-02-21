import { Router } from 'express';
import { z } from 'zod';

import { cefrLevelSchema, wordStateSchema } from '@vocabmaster/shared';
import type { CefrLevel, WordState } from '@prisma/client';
import { requireAuth } from './auth-middleware';
import {
  getForgottenReviewQueue,
  getProgressStats,
  getSessionWords,
  getTargetLevel,
  setTargetLevel,
  updateWordState
} from './learning-service';
import { ApiError } from './errors';

const countSchema = z.coerce.number().int().min(1).max(100).default(20);

type LearningDeps = {
  getTargetLevel: (userId: string) => Promise<{ level: CefrLevel | null }>;
  setTargetLevel: (userId: string, level: CefrLevel) => Promise<{ level: CefrLevel }>;
  getSessionWords: (userId: string, count: number) => Promise<{ words: Array<{ id: string; text: string; meaning: string; level: CefrLevel; state: WordState | null }> }>;
  updateWordState: (userId: string, wordId: string, state: WordState) => Promise<{ wordId: string; state: WordState }>;
  getForgottenReviewQueue: (userId: string, count: number) => Promise<{ words: Array<{ id: string; text: string; meaning: string; level: CefrLevel; lastReviewedAt: string | null }> }>;
  getProgressStats: (userId: string) => Promise<{ level: CefrLevel | null; totalTracked: number; known: number; learning: number; forgotten: number }>;
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
    const count = countSchema.parse(req.query.count ?? 20);
    const result = await deps.getSessionWords(req.userId!, count);
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
    const count = countSchema.parse(req.query.count ?? 20);
    const result = await deps.getForgottenReviewQueue(req.userId!, count);
    res.status(200).json(result);
  });

  router.get('/progress', async (req, res) => {
    const result = await deps.getProgressStats(req.userId!);
    res.status(200).json(result);
  });

  return router;
}

export const learningRouter = createLearningRouter({
  getTargetLevel,
  setTargetLevel,
  getSessionWords,
  updateWordState,
  getForgottenReviewQueue,
  getProgressStats
});
