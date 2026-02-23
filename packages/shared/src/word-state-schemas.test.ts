import test from 'node:test';
import assert from 'node:assert/strict';

import { wordStateSchema } from './word-state-schemas';

test('wordStateSchema accepts known values', () => {
  assert.equal(wordStateSchema.parse('Known'), 'Known');
  assert.equal(wordStateSchema.parse('Learning'), 'Learning');
  assert.equal(wordStateSchema.parse('Forgotten'), 'Forgotten');
});

test('wordStateSchema rejects unsupported values', () => {
  const result = wordStateSchema.safeParse('New');
  assert.equal(result.success, false);
});
