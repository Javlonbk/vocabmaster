import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateNextReview } from './spaced-repetition';

test('calculateNextReview increases interval on correct', () => {
  const result = calculateNextReview({ state: 'Known', currentInterval: 3, currentEase: 2.5 });
  assert.equal(result.repetitionInterval, 7);
  assert.ok(result.easeFactor > 2.5);
});

test('calculateNextReview decreases interval on incorrect', () => {
  const result = calculateNextReview({ state: 'Learning', currentInterval: 7, currentEase: 2.5 });
  assert.equal(result.repetitionInterval, 3);
  assert.ok(result.easeFactor < 2.5);
});

test('calculateNextReview clamps ease factor', () => {
  const low = calculateNextReview({ state: 'Learning', currentInterval: 1, currentEase: 1.0 });
  assert.ok(low.easeFactor >= 1.3);
});
