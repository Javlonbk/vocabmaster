import assert from 'node:assert/strict';
import test from 'node:test';

import jwt from 'jsonwebtoken';
import request from 'supertest';

import { createApp } from './app';
import { createReadingRouter } from './routes/reading-routes';

process.env.AUTH_JWT_SECRET = 'test-secret';

const authHeader = {
  Authorization: `Bearer ${jwt.sign({ sub: 'user-1', email: 'u@example.com' }, process.env.AUTH_JWT_SECRET)}`
};

test('GET /v1/reading/passages returns list for authenticated user', async () => {
  const app = createApp({
    readingRoutes: createReadingRouter({
      getReadingPassages: async () => ({
        passages: [
          {
            id: 'reading-1',
            title: 'Sample Passage',
            level: 'A1',
            topic: 'Daily Life',
            estimatedMinutes: 2,
            vocabularyCount: 3,
            progressPercent: 0,
            bookmarked: false,
            lastReadAt: null
          }
        ]
      }),
      getReadingPassage: async () => ({
        id: 'reading-1',
        title: 'Sample Passage',
        content: 'Hello',
        level: 'A1',
        topic: 'Daily Life',
        estimatedMinutes: 2,
        vocabulary: [],
        progressPercent: 0,
        bookmarked: false,
        lastReadAt: null
      }),
      updateReadingProgress: async () => ({ progressPercent: 50, lastReadAt: new Date().toISOString() }),
      updateReadingBookmark: async () => ({ bookmarked: true }),
      markReadingWordLearned: async (userId, wordId) => ({ wordId, state: 'Known' })
    })
  });

  const response = await request(app).get('/v1/reading/passages').set(authHeader);

  assert.equal(response.status, 200);
  assert.equal(response.body.passages.length, 1);
});

test('GET /v1/reading/passages validates count query', async () => {
  const app = createApp({
    readingRoutes: createReadingRouter({
      getReadingPassages: async () => ({ passages: [] }),
      getReadingPassage: async () => ({
        id: 'reading-1',
        title: 'Sample Passage',
        content: 'Hello',
        level: 'A1',
        topic: 'Daily Life',
        estimatedMinutes: 2,
        vocabulary: [],
        progressPercent: 0,
        bookmarked: false,
        lastReadAt: null
      }),
      updateReadingProgress: async () => ({ progressPercent: 50, lastReadAt: new Date().toISOString() }),
      updateReadingBookmark: async () => ({ bookmarked: true }),
      markReadingWordLearned: async (userId, wordId) => ({ wordId, state: 'Known' })
    })
  });

  const response = await request(app).get('/v1/reading/passages?count=200').set(authHeader);

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('PUT /v1/reading/passages/:id/progress validates payload', async () => {
  const app = createApp({
    readingRoutes: createReadingRouter({
      getReadingPassages: async () => ({ passages: [] }),
      getReadingPassage: async () => ({
        id: 'reading-1',
        title: 'Sample Passage',
        content: 'Hello',
        level: 'A1',
        topic: 'Daily Life',
        estimatedMinutes: 2,
        vocabulary: [],
        progressPercent: 0,
        bookmarked: false,
        lastReadAt: null
      }),
      updateReadingProgress: async () => ({ progressPercent: 50, lastReadAt: new Date().toISOString() }),
      updateReadingBookmark: async () => ({ bookmarked: true }),
      markReadingWordLearned: async (userId, wordId) => ({ wordId, state: 'Known' })
    })
  });

  const response = await request(app)
    .put('/v1/reading/passages/reading-1/progress')
    .set(authHeader)
    .send({ progressPercent: 120 });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('POST /v1/reading/words/:id/learned requires auth', async () => {
  const app = createApp({
    readingRoutes: createReadingRouter({
      getReadingPassages: async () => ({ passages: [] }),
      getReadingPassage: async () => ({
        id: 'reading-1',
        title: 'Sample Passage',
        content: 'Hello',
        level: 'A1',
        topic: 'Daily Life',
        estimatedMinutes: 2,
        vocabulary: [],
        progressPercent: 0,
        bookmarked: false,
        lastReadAt: null
      }),
      updateReadingProgress: async () => ({ progressPercent: 50, lastReadAt: new Date().toISOString() }),
      updateReadingBookmark: async () => ({ bookmarked: true }),
      markReadingWordLearned: async (userId, wordId) => ({ wordId, state: 'Known' })
    })
  });

  const response = await request(app).post('/v1/reading/words/word-1/learned');

  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'UNAUTHORIZED');
});
