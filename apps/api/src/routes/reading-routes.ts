import { Router } from 'express';
import { z } from 'zod';

import { cefrLevelSchema, topicSchema } from '@vocabmaster/shared';
import type { CefrLevel } from '@vocabmaster/shared';
import { createReadingController, type ReadingController } from '../controllers/reading-controller';
import { requireAuth } from '../middlewares/auth-middleware';
import { ApiError } from '../utils/errors';

const countSchema = z.coerce.number().int().min(1).max(60).default(20);

const progressSchema = z.object({
  progressPercent: z.number().min(0).max(100)
});

const bookmarkSchema = z.object({
  bookmarked: z.boolean()
});

type ReadingDeps = {
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

export function createReadingRouter(deps: ReadingDeps): Router {
  const router = Router();

  router.use(requireAuth);

  router.get('/passages', async (req, res) => {
    const querySchema = z.object({
      count: countSchema,
      level: cefrLevelSchema.optional(),
      topic: topicSchema.optional(),
      search: z.string().trim().min(1).optional(),
      bookmarked: z.coerce.boolean().optional()
    });

    const parsedQuery = querySchema.safeParse({
      count: req.query.count ?? 20,
      level: req.query.level,
      topic: req.query.topic,
      search: req.query.search,
      bookmarked: req.query.bookmarked
    });

    if (!parsedQuery.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parsedQuery.error.flatten());
    }

    const result = await deps.getReadingPassages(req.userId!, parsedQuery.data);
    res.status(200).json(result);
  });

  router.get('/passages/:passageId', async (req, res) => {
    const result = await deps.getReadingPassage(req.userId!, req.params.passageId);
    res.status(200).json(result);
  });

  router.put('/passages/:passageId/progress', async (req, res) => {
    const parsed = progressSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parsed.error.flatten());
    }
    const result = await deps.updateReadingProgress(req.userId!, req.params.passageId, parsed.data.progressPercent);
    res.status(200).json(result);
  });

  router.post('/passages/:passageId/bookmark', async (req, res) => {
    const parsed = bookmarkSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parsed.error.flatten());
    }
    const result = await deps.updateReadingBookmark(req.userId!, req.params.passageId, parsed.data.bookmarked);
    res.status(200).json(result);
  });

  router.post('/words/:wordId/learned', async (req, res) => {
    const result = await deps.markReadingWordLearned(req.userId!, req.params.wordId);
    res.status(200).json(result);
  });

  return router;
}

function toRouteDeps(controller: ReadingController): ReadingDeps {
  return {
    getReadingPassages: controller.getReadingPassages,
    getReadingPassage: controller.getReadingPassage,
    updateReadingProgress: controller.updateReadingProgress,
    updateReadingBookmark: controller.updateReadingBookmark,
    markReadingWordLearned: controller.markReadingWordLearned
  };
}

export const readingRouter = createReadingRouter(toRouteDeps(createReadingController()));
