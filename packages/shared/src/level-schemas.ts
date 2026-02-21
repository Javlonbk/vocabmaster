import { z } from 'zod';

export const cefrLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

export const levelSelectionInputSchema = z.object({
  level: cefrLevelSchema
});

export type CefrLevel = z.infer<typeof cefrLevelSchema>;
export type LevelSelectionInput = z.infer<typeof levelSelectionInputSchema>;
