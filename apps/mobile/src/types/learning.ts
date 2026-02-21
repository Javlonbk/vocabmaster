import type { CefrLevel, WordState } from './shared';

export type ProgressStats = {
  level: CefrLevel | null;
  totalTracked: number;
  known: number;
  learning: number;
  forgotten: number;
};

export type LearningWord = {
  id: string;
  text: string;
  meaning: string;
  level: CefrLevel;
  state: WordState | null;
};

export type ForgottenWord = {
  id: string;
  text: string;
  meaning: string;
  level: CefrLevel;
  lastReviewedAt: string | null;
};
