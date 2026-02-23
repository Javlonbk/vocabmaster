import assert from 'node:assert/strict';
import test from 'node:test';

import jwt from 'jsonwebtoken';
import request from 'supertest';

import { createApp } from './app';
import { createSearchRouter } from './routes/search-routes';

process.env.AUTH_JWT_SECRET = 'test-secret';

const authHeader = {
  Authorization: `Bearer ${jwt.sign({ sub: 'user-1', email: 'u@example.com' }, process.env.AUTH_JWT_SECRET)}`
};

test('GET /v1/words/search returns results for authenticated user', async () => {
  const app = createApp({
    searchRoutes: createSearchRouter({
      searchWords: async () => ({ results: [], total: 0, page: 1, count: 20, hasMore: false }),
      getSearchFilterOptions: () => ({
        levels: ['A1'],
        topics: ['Daily Life'],
        partsOfSpeech: ['noun'],
        states: ['Known'],
        mastery: ['InProgress'],
        sortOptions: ['alphabetical_asc']
      })
    })
  });

  const response = await request(app).get('/v1/words/search?q=book').set(authHeader);

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.results, []);
});

test('GET /v1/words/search validates count query', async () => {
  const app = createApp({
    searchRoutes: createSearchRouter({
      searchWords: async () => ({ results: [], total: 0, page: 1, count: 20, hasMore: false }),
      getSearchFilterOptions: () => ({
        levels: ['A1'],
        topics: ['Daily Life'],
        partsOfSpeech: ['noun'],
        states: ['Known'],
        mastery: ['InProgress'],
        sortOptions: ['alphabetical_asc']
      })
    })
  });

  const response = await request(app).get('/v1/words/search?count=200').set(authHeader);

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('GET /v1/words/filters requires auth', async () => {
  const app = createApp({
    searchRoutes: createSearchRouter({
      searchWords: async () => ({ results: [], total: 0, page: 1, count: 20, hasMore: false }),
      getSearchFilterOptions: () => ({
        levels: ['A1'],
        topics: ['Daily Life'],
        partsOfSpeech: ['noun'],
        states: ['Known'],
        mastery: ['InProgress'],
        sortOptions: ['alphabetical_asc']
      })
    })
  });

  const response = await request(app).get('/v1/words/filters');

  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'UNAUTHORIZED');
});
