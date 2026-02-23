import type { CefrLevel, WordState } from '../types/shared';
import type { ForgottenWord, LearningWord, ProgressStats } from '../types/learning';
import { API_BASE_URL } from '../config/api';

async function request<T>(token: string, path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {})
    }
  });

  const data = (await response.json()) as T | { error?: { message?: string } };

  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'error' in data ? data.error?.message : undefined;
    throw new Error(message || 'Request failed');
  }

  return data as T;
}

export async function getProgress(token: string): Promise<ProgressStats> {
  return request<ProgressStats>(token, '/v1/learning/progress');
}

export async function getTargetLevel(token: string): Promise<{ level: CefrLevel | null }> {
  return request<{ level: CefrLevel | null }>(token, '/v1/learning/target-level');
}

export async function setTargetLevel(token: string, level: CefrLevel): Promise<{ level: CefrLevel }> {
  return request<{ level: CefrLevel }>(token, '/v1/learning/target-level', {
    method: 'PUT',
    body: JSON.stringify({ level })
  });
}

export async function getSessionWords(token: string, count = 20, topic?: string): Promise<{ words: LearningWord[] }> {
  const topicParam = topic ? `&topic=${encodeURIComponent(topic)}` : '';
  return request<{ words: LearningWord[] }>(token, `/v1/learning/session/words?count=${count}${topicParam}`);
}

export async function updateWordState(token: string, wordId: string, state: WordState): Promise<void> {
  await request(token, `/v1/learning/words/${wordId}/state`, {
    method: 'PATCH',
    body: JSON.stringify({ state })
  });
}

export async function getForgottenQueue(token: string, count = 20): Promise<{ words: ForgottenWord[] }> {
  return request<{ words: ForgottenWord[] }>(token, `/v1/learning/review/forgotten?count=${count}`);
}

export async function getReviewQueue(token: string, count = 20): Promise<{ words: LearningWord[] }> {
  return request<{ words: LearningWord[] }>(token, `/v1/learning/review/queue?count=${count}`);
}
