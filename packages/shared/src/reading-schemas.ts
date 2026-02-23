import { z } from 'zod';

import { cefrLevelSchema } from './level-schemas';
import { topicSchema } from './vocabulary-schemas';

export const readingPassageSeedSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  level: cefrLevelSchema,
  topic: topicSchema,
  estimatedMinutes: z.number().int().min(1),
  vocabularyWords: z.array(z.string().trim().min(1)).min(1)
});

export const readingPassageSeedListSchema = z.array(readingPassageSeedSchema).min(1);

export type ReadingPassageSeed = z.infer<typeof readingPassageSeedSchema>;
