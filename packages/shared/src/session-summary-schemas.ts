import { z } from 'zod';

import { wordStateSchema } from './word-state-schemas';

export const sessionWordResultSchema = z.object({
  wordId: z.string().uuid(),
  state: wordStateSchema
});

export const sessionSummaryPayloadSchema = z
  .object({
    totalWords: z.number().int().nonnegative(),
    knownCount: z.number().int().nonnegative(),
    learningCount: z.number().int().nonnegative(),
    forgottenCount: z.number().int().nonnegative(),
    results: z.array(sessionWordResultSchema),
    completedAt: z.iso.datetime()
  })
  .superRefine((value, ctx) => {
    const totalFromCounts = value.knownCount + value.learningCount + value.forgottenCount;

    if (totalFromCounts !== value.totalWords) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'totalWords must equal knownCount + learningCount + forgottenCount',
        path: ['totalWords']
      });
    }

    if (value.results.length !== value.totalWords) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'results length must equal totalWords',
        path: ['results']
      });
    }
  });

export type SessionWordResult = z.infer<typeof sessionWordResultSchema>;
export type SessionSummaryPayload = z.infer<typeof sessionSummaryPayloadSchema>;
