import { z } from 'zod';

export const wordStateSchema = z.enum(['Known', 'Learning', 'Forgotten']);

export type WordState = z.infer<typeof wordStateSchema>;
