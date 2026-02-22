import type { CefrLevel, WordState } from './shared';

export type MasteryLabel = 'Mastered' | 'InProgress' | 'Struggling' | 'NotStarted';

export type SearchWord = {
  id: string;
  text: string;
  meaning: string;
  phonetic: string;
  audio: string;
  example: string;
  topic: string;
  partOfSpeech: string;
  level: CefrLevel;
  frequency: number;
  state: WordState | null;
  reviewCount: number;
  forgottenCount: number;
  accuracy: number;
  mastery: MasteryLabel;
  lastReviewedAt: string | null;
  learnedAt: string | null;
};

export type SearchFilters = {
  levels: CefrLevel[];
  topics: string[];
  partsOfSpeech: string[];
  states: Array<WordState | 'NotStarted'>;
  mastery: MasteryLabel[];
};

export type SearchSort =
  | 'alphabetical_asc'
  | 'alphabetical_desc'
  | 'level_asc'
  | 'level_desc'
  | 'learned_desc'
  | 'learned_asc'
  | 'frequency_desc'
  | 'frequency_asc'
  | 'accuracy_desc'
  | 'accuracy_asc';

export type SearchFiltersResponse = {
  levels: CefrLevel[];
  topics: string[];
  partsOfSpeech: string[];
  states: Array<WordState | 'NotStarted'>;
  mastery: MasteryLabel[];
  sortOptions: SearchSort[];
};
