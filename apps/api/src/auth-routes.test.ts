import assert from 'node:assert/strict';
import test from 'node:test';

import request from 'supertest';

import { createApp } from './app';
import { createAuthRouter } from './routes/auth-routes';
import { ApiError } from './utils/errors';

test('POST /v1/auth/signup returns token on valid payload', async () => {
  const app = createApp({
    authRoutes: createAuthRouter({
      signupHandler: async () => ({ token: 'signup-token' }),
      loginHandler: async () => ({ token: 'login-token' })
    })
  });

  const response = await request(app).post('/v1/auth/signup').send({
    email: 'new@example.com',
    password: 'strongPass1'
  });

  assert.equal(response.status, 201);
  assert.deepEqual(response.body, { token: 'signup-token' });
});

test('POST /v1/auth/login returns validation error for invalid payload', async () => {
  const app = createApp({
    authRoutes: createAuthRouter({
      signupHandler: async () => ({ token: 'signup-token' }),
      loginHandler: async () => ({ token: 'login-token' })
    })
  });

  const response = await request(app).post('/v1/auth/login').send({
    email: 'not-an-email',
    password: 'short'
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  assert.equal(response.body.error.message, 'Invalid request payload');
});

test('POST /v1/auth/login returns standardized service error', async () => {
  const app = createApp({
    authRoutes: createAuthRouter({
      signupHandler: async () => ({ token: 'signup-token' }),
      loginHandler: async () => {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }
    })
  });

  const response = await request(app).post('/v1/auth/login').send({
    email: 'user@example.com',
    password: 'strongPass1'
  });

  assert.equal(response.status, 401);
  assert.deepEqual(response.body, {
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password'
    }
  });
});
