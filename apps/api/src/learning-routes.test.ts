import assert from 'node:assert/strict';
import test from 'node:test';

import jwt from 'jsonwebtoken';
import request from 'supertest';

import { createApp } from './app';
import { createLearningRouter } from './learning-routes';

process.env.AUTH_JWT_SECRET = 'test-secret';

const authHeader = {
  Authorization: `Bearer ${jwt.sign({ sub: 'user-1', email: 'u@example.com' }, process.env.AUTH_JWT_SECRET)}`
};

test('GET /v1/learning/progress returns stats for authenticated user', async () => {
  const app = createApp({
    learningRoutes: createLearningRouter({
      getTargetLevel: async () => ({ level: 'B2' }),
      setTargetLevel: async (_userId, level) => ({ level }),
      getSessionWords: async () => ({ words: [] }),
      updateWordState: async (_u, wordId, state) => ({ wordId, state }),
      getForgottenReviewQueue: async () => ({ words: [] }),
      getProgressStats: async () => ({ level: 'B2', totalTracked: 5, known: 2, learning: 2, forgotten: 1 })
    })
  });

  const response = await request(app).get('/v1/learning/progress').set(authHeader);

  assert.equal(response.status, 200);
  assert.equal(response.body.level, 'B2');
  assert.equal(response.body.totalTracked, 5);
});

test('PUT /v1/learning/target-level validates level payload', async () => {
  const app = createApp({
    learningRoutes: createLearningRouter({
      getTargetLevel: async () => ({ level: null }),
      setTargetLevel: async (_userId, level) => ({ level }),
      getSessionWords: async () => ({ words: [] }),
      updateWordState: async (_u, wordId, state) => ({ wordId, state }),
      getForgottenReviewQueue: async () => ({ words: [] }),
      getProgressStats: async () => ({ level: null, totalTracked: 0, known: 0, learning: 0, forgotten: 0 })
    })
  });

  const response = await request(app).put('/v1/learning/target-level').set(authHeader).send({ level: 'D9' });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('PATCH /v1/learning/words/:id/state requires auth', async () => {
  const app = createApp({
    learningRoutes: createLearningRouter({
      getTargetLevel: async () => ({ level: null }),
      setTargetLevel: async (_userId, level) => ({ level }),
      getSessionWords: async () => ({ words: [] }),
      updateWordState: async (_u, wordId, state) => ({ wordId, state }),
      getForgottenReviewQueue: async () => ({ words: [] }),
      getProgressStats: async () => ({ level: null, totalTracked: 0, known: 0, learning: 0, forgotten: 0 })
    })
  });

  const response = await request(app).patch('/v1/learning/words/word-1/state').send({ state: 'Known' });

  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'UNAUTHORIZED');
});
