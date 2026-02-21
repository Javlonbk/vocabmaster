import test from 'node:test';
import assert from 'node:assert/strict';

import { sessionSummaryPayloadSchema } from './session-summary-schemas';

const validSummary = {
  totalWords: 3,
  knownCount: 1,
  learningCount: 1,
  forgottenCount: 1,
  results: [
    { wordId: '53dcf0ed-c2c5-486a-94ad-4eef4f389fd1', state: 'Known' },
    { wordId: '39f8caaf-0f52-4483-ba58-a95e8eb67dd5', state: 'Learning' },
    { wordId: 'c35ddffe-29bf-4a9d-9b3e-615f95f8d5c6', state: 'Forgotten' }
  ],
  completedAt: '2026-02-21T12:00:00.000Z'
} as const;

test('sessionSummaryPayloadSchema accepts valid payload', () => {
  const parsed = sessionSummaryPayloadSchema.parse(validSummary);
  assert.equal(parsed.totalWords, 3);
});

test('sessionSummaryPayloadSchema rejects mismatched counters', () => {
  const result = sessionSummaryPayloadSchema.safeParse({
    ...validSummary,
    knownCount: 2
  });
  assert.equal(result.success, false);
});

test('sessionSummaryPayloadSchema rejects mismatched result length', () => {
  const result = sessionSummaryPayloadSchema.safeParse({
    ...validSummary,
    totalWords: 4
  });
  assert.equal(result.success, false);
});
