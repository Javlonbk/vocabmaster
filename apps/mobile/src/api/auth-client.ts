import type { ApiErrorResponse, AuthRequest, AuthSuccessResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:3000';

function sanitizeErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

async function sendAuthRequest(path: '/v1/auth/login' | '/v1/auth/signup', payload: AuthRequest): Promise<AuthSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as AuthSuccessResponse | ApiErrorResponse;

  if (!response.ok) {
    if ('error' in data) {
      throw new Error(data.error.message || 'Authentication failed. Please try again.');
    }

    throw new Error('Authentication failed. Please try again.');
  }

  if (!('token' in data)) {
    throw new Error('Invalid auth response from server.');
  }

  return data;
}

export async function login(payload: AuthRequest): Promise<AuthSuccessResponse> {
  try {
    return await sendAuthRequest('/v1/auth/login', payload);
  } catch (error: unknown) {
    throw new Error(sanitizeErrorMessage(error));
  }
}

export async function signup(payload: AuthRequest): Promise<AuthSuccessResponse> {
  try {
    return await sendAuthRequest('/v1/auth/signup', payload);
  } catch (error: unknown) {
    throw new Error(sanitizeErrorMessage(error));
  }
}
