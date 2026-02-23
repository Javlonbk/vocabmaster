import test from 'node:test';
import assert from 'node:assert/strict';

import { cefrLevelSchema, levelSelectionInputSchema } from './level-schemas';

test('cefrLevelSchema accepts valid levels', () => {
  const parsed = cefrLevelSchema.parse('B2');
  assert.equal(parsed, 'B2');
});

test('cefrLevelSchema rejects invalid levels', () => {
  const result = cefrLevelSchema.safeParse('D1');
  assert.equal(result.success, false);
});

test('levelSelectionInputSchema requires level field', () => {
  const result = levelSelectionInputSchema.safeParse({});
  assert.equal(result.success, false);
});
