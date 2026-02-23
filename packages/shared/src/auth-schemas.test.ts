import test from 'node:test';
import assert from 'node:assert/strict';

import { loginInputSchema, signupInputSchema } from './auth-schemas';

test('signupInputSchema accepts valid payload', () => {
  const parsed = signupInputSchema.parse({ email: 'user@example.com', password: 'strongPass1' });
  assert.equal(parsed.email, 'user@example.com');
});

test('loginInputSchema rejects invalid email', () => {
  const result = loginInputSchema.safeParse({ email: 'bad-email', password: 'strongPass1' });
  assert.equal(result.success, false);
});

test('signupInputSchema rejects short passwords', () => {
  const result = signupInputSchema.safeParse({ email: 'user@example.com', password: 'short' });
  assert.equal(result.success, false);
});
