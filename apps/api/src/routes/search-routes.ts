import { Router } from 'express';
import { z } from 'zod';

import { cefrLevelSchema, partOfSpeechSchema, topicSchema, wordStateSchema } from '@vocabmaster/shared';
import type { CefrLevel, WordState } from '@vocabmaster/shared';
import { createSearchController, type SearchController } from '../controllers/search-controller';
import { requireAuth } from '../middlewares/auth-middleware';
import { ApiError } from '../utils/errors';
import type { MasteryLabel } from '../utils/search-utils';
import type { SearchFilters, SearchSort, SearchStateFilter } from '../services/search-service';

const countSchema = z.coerce.number().int().min(1).max(60).default(20);
const pageSchema = z.coerce.number().int().min(1).max(50).default(1);

const masterySchema = z.enum(['Mastered', 'InProgress', 'Struggling', 'NotStarted']);
const searchSortSchema = z.enum([
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
]);
const stateFilterSchema = z.union([wordStateSchema, z.literal('NotStarted')]);

const querySchema = z.object({
  q: z.string().trim().min(1).optional(),
  levels: z.string().optional(),
  topics: z.string().optional(),
  parts: z.string().optional(),
  states: z.string().optional(),
  mastery: z.string().optional(),
  sort: searchSortSchema.optional(),
  page: pageSchema,
  count: countSchema
});

function parseList<T>(raw: string | undefined, schema: z.ZodType<T>): T[] | undefined {
  if (!raw) return undefined;
  const items = raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  if (items.length === 0) return undefined;
  const parsed: T[] = [];
  for (const item of items) {
    const result = schema.safeParse(item);
    if (!result.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', result.error.flatten());
    }
    parsed.push(result.data);
  }
  return parsed;
}

type SearchDeps = {
  searchWords: (userId: string, filters: SearchFilters) => Promise<{ results: unknown[]; total: number; page: number; count: number; hasMore: boolean }>;
  getSearchFilterOptions: () => {
    levels: CefrLevel[];
    topics: string[];
    partsOfSpeech: string[];
    states: SearchStateFilter[];
    mastery: MasteryLabel[];
    sortOptions: SearchSort[];
  };
};

export function createSearchRouter(deps: SearchDeps): Router {
  const router = Router();

  router.use(requireAuth);

  router.get('/search', async (req, res) => {
    const parsedQuery = querySchema.safeParse({
      q: req.query.q,
      levels: req.query.levels,
      topics: req.query.topics,
      parts: req.query.parts,
      states: req.query.states,
      mastery: req.query.mastery,
      sort: req.query.sort,
      page: req.query.page ?? 1,
      count: req.query.count ?? 20
    });

    if (!parsedQuery.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', parsedQuery.error.flatten());
    }

    const levels = parseList(parsedQuery.data.levels, cefrLevelSchema);
    const topics = parseList(parsedQuery.data.topics, topicSchema);
    const parts = parseList(parsedQuery.data.parts, partOfSpeechSchema);
    const states = parseList(parsedQuery.data.states, stateFilterSchema);
    const mastery = parseList(parsedQuery.data.mastery, masterySchema);

    const filters: SearchFilters = {
      query: parsedQuery.data.q,
      levels,
      topics,
      partsOfSpeech: parts,
      states: states as Array<WordState | 'NotStarted'> | undefined,
      mastery: mastery as MasteryLabel[] | undefined,
      sort: parsedQuery.data.sort ?? 'alphabetical_asc',
      page: parsedQuery.data.page,
      count: parsedQuery.data.count
    };

    const result = await deps.searchWords(req.userId!, filters);
    res.status(200).json(result);
  });

  router.get('/filters', (_req, res) => {
    res.status(200).json(deps.getSearchFilterOptions());
  });

  return router;
}

function toRouteDeps(controller: SearchController): SearchDeps {
  return {
    searchWords: controller.searchWords,
    getSearchFilterOptions: controller.getSearchFilterOptions
  };
}

export const searchRouter = createSearchRouter(toRouteDeps(createSearchController()));
