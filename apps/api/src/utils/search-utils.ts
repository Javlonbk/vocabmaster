import type { WordState } from '@vocabmaster/shared';

export type MasteryLabel = 'Mastered' | 'InProgress' | 'Struggling' | 'NotStarted';

export function calculateAccuracy(reviewCount: number, forgottenCount: number): number {
  if (reviewCount <= 0) return 0;
  const correct = Math.max(reviewCount - forgottenCount, 0);
  return correct / reviewCount;
}

export function classifyMastery(state: WordState | null, reviewCount: number, forgottenCount: number): MasteryLabel {
  if (!state) return 'NotStarted';

  const accuracy = calculateAccuracy(reviewCount, forgottenCount);

  if (state === 'Known' && reviewCount >= 3 && accuracy >= 0.9) {
    return 'Mastered';
  }

  if (state === 'Forgotten' || (reviewCount >= 3 && accuracy < 0.6) || forgottenCount >= 2) {
    return 'Struggling';
  }

  return 'InProgress';
}
