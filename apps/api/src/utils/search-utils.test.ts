import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateAccuracy, classifyMastery } from './search-utils';

test('calculateAccuracy returns 0 when no reviews', () => {
  assert.equal(calculateAccuracy(0, 0), 0);
});

test('calculateAccuracy clamps negative correct', () => {
  assert.equal(calculateAccuracy(1, 5), 0);
});

test('classifyMastery returns NotStarted when no state', () => {
  assert.equal(classifyMastery(null, 0, 0), 'NotStarted');
});

test('classifyMastery returns Mastered for high accuracy known words', () => {
  assert.equal(classifyMastery('Known', 10, 0), 'Mastered');
});

test('classifyMastery returns Struggling for forgotten words', () => {
  assert.equal(classifyMastery('Forgotten', 3, 2), 'Struggling');
});

test('classifyMastery returns InProgress for learning words', () => {
  assert.equal(classifyMastery('Learning', 2, 0), 'InProgress');
});
