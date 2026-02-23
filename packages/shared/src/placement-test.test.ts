import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateRecommendedLevel, getNextAdaptiveLevel } from './placement-test';

test('getNextAdaptiveLevel steps up on correct answers', () => {
  assert.equal(getNextAdaptiveLevel('B1', true), 'B2');
  assert.equal(getNextAdaptiveLevel('C2', true), 'C2');
});

test('getNextAdaptiveLevel steps down on incorrect answers', () => {
  assert.equal(getNextAdaptiveLevel('B1', false), 'A2');
  assert.equal(getNextAdaptiveLevel('A1', false), 'A1');
});

test('calculateRecommendedLevel falls back to A1 when no correct answers', () => {
  const recommended = calculateRecommendedLevel([
    { level: 'B1', correct: false },
    { level: 'A2', correct: false }
  ]);

  assert.equal(recommended, 'A1');
});

test('calculateRecommendedLevel averages correct answers with accuracy adjustment', () => {
  const recommended = calculateRecommendedLevel([
    { level: 'B1', correct: true },
    { level: 'B2', correct: true },
    { level: 'B2', correct: true },
    { level: 'B2', correct: true }
  ]);

  assert.equal(recommended, 'C1');
});
