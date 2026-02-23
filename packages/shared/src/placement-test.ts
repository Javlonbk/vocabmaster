import type { CefrLevel } from './level-schemas';

export type PlacementAnswer = {
  level: CefrLevel;
  correct: boolean;
};

const LEVEL_ORDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function toLevelIndex(level: CefrLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

function fromLevelIndex(index: number): CefrLevel {
  const clamped = Math.min(Math.max(index, 0), LEVEL_ORDER.length - 1);
  return LEVEL_ORDER[clamped];
}

export function getNextAdaptiveLevel(current: CefrLevel, correct: boolean): CefrLevel {
  const delta = correct ? 1 : -1;
  return fromLevelIndex(toLevelIndex(current) + delta);
}

export function calculateRecommendedLevel(answers: PlacementAnswer[], fallbackLevel: CefrLevel = 'B1'): CefrLevel {
  if (answers.length === 0) return fallbackLevel;

  const correctAnswers = answers.filter((answer) => answer.correct);
  if (correctAnswers.length === 0) return 'A1';

  const avgCorrectLevel =
    correctAnswers.reduce((sum, answer) => sum + toLevelIndex(answer.level), 0) / correctAnswers.length;
  const accuracy = correctAnswers.length / answers.length;

  let adjustment = 0;
  if (accuracy >= 0.85) adjustment = 1;
  if (accuracy <= 0.4) adjustment = -1;

  return fromLevelIndex(Math.round(avgCorrectLevel) + adjustment);
}
