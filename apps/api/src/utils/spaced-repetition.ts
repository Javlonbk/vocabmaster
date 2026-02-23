import type { WordState } from '@vocabmaster/shared';

const INTERVALS = [1, 3, 7, 14, 30, 90];
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;

type ScheduleInput = {
  state: WordState;
  currentInterval?: number | null;
  currentEase?: number | null;
};

type ScheduleOutput = {
  nextReviewAt: Date;
  repetitionInterval: number;
  easeFactor: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function findIntervalIndex(interval: number): number {
  const index = INTERVALS.indexOf(interval);
  if (index >= 0) return index;
  for (let i = 0; i < INTERVALS.length; i += 1) {
    if (interval <= INTERVALS[i]) return i;
  }
  return INTERVALS.length - 1;
}

function isCorrect(state: WordState): boolean {
  return state === 'Known';
}

export function calculateNextReview({ state, currentInterval, currentEase }: ScheduleInput): ScheduleOutput {
  const now = new Date();
  const interval = currentInterval && currentInterval > 0 ? currentInterval : INTERVALS[0];
  const ease = currentEase && currentEase > 0 ? currentEase : 2.5;
  const correct = isCorrect(state);

  let nextInterval = interval;
  let nextEase = ease;

  if (correct) {
    const index = findIntervalIndex(interval);
    nextInterval = INTERVALS[Math.min(index + 1, INTERVALS.length - 1)];
    nextEase = clamp(ease + 0.15, MIN_EASE, MAX_EASE);
  } else {
    const index = findIntervalIndex(interval);
    nextInterval = INTERVALS[Math.max(index - 1, 0)];
    nextEase = clamp(ease - 0.2, MIN_EASE, MAX_EASE);
  }

  const nextReviewAt = new Date(now.getTime());
  nextReviewAt.setDate(nextReviewAt.getDate() + nextInterval);

  return {
    nextReviewAt,
    repetitionInterval: nextInterval,
    easeFactor: nextEase
  };
}
