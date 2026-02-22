import { z } from 'zod';

import { cefrLevelSchema } from './level-schemas';

export const topicSchema = z.enum([
  'Daily Life',
  'Travel & Transportation',
  'Food & Dining',
  'Business',
  'Work',
  'Education',
  'Health & Medicine',
  'Technology',
  'Arts & Culture',
  'Nature & Environment',
  'Sports & Hobbies',
  'Emotions & Feelings',
  'Time & Dates'
]);

export const partOfSpeechSchema = z.enum([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'interjection'
]);

export const vocabularySeedSchema = z.object({
  word: z.string().trim().min(1),
  phonetic: z.string().trim().min(1),
  audio: z.string().trim().min(1),
  definition: z.string().trim().min(1),
  example: z.string().trim().min(1),
  level: cefrLevelSchema,
  topic: topicSchema,
  partOfSpeech: partOfSpeechSchema
});

export const vocabularySeedListSchema = z.array(vocabularySeedSchema).min(1);

export type Topic = z.infer<typeof topicSchema>;
export type PartOfSpeech = z.infer<typeof partOfSpeechSchema>;
export type VocabularySeed = z.infer<typeof vocabularySeedSchema>;
