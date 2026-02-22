import type { ApiErrorResponse, AuthRequest, AuthSuccessResponse } from '../types/auth';
import { API_BASE_URL } from '../config/api';

function sanitizeErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

async function sendAuthRequest(path: '/v1/auth/login' | '/v1/auth/signup', payload: AuthRequest): Promise<AuthSuccessResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error: unknown) {
    console.warn('Auth request failed', { apiBaseUrl: API_BASE_URL, path, error });
    throw new Error(`Network request failed. API: ${API_BASE_URL}`);
  }

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
