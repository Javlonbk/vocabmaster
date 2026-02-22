import { API_BASE_URL } from '../config/api';
import type { ReadingPassageDetail, ReadingPassageSummary } from '../types/reading';
import type { CefrLevel } from '../types/shared';

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

export async function getReadingPassages(
  token: string,
  options: { level?: CefrLevel; topic?: string; search?: string; bookmarked?: boolean; count?: number } = {}
): Promise<{ passages: ReadingPassageSummary[] }> {
  const params = new URLSearchParams();
  if (options.count) params.set('count', String(options.count));
  if (options.level) params.set('level', options.level);
  if (options.topic) params.set('topic', options.topic);
  if (options.search) params.set('search', options.search);
  if (options.bookmarked !== undefined) params.set('bookmarked', String(options.bookmarked));

  const query = params.toString();
  return request<{ passages: ReadingPassageSummary[] }>(token, `/v1/reading/passages${query ? `?${query}` : ''}`);
}

export async function getReadingPassage(token: string, passageId: string): Promise<ReadingPassageDetail> {
  return request<ReadingPassageDetail>(token, `/v1/reading/passages/${passageId}`);
}

export async function updateReadingProgress(token: string, passageId: string, progressPercent: number): Promise<{ progressPercent: number; lastReadAt: string }> {
  return request<{ progressPercent: number; lastReadAt: string }>(token, `/v1/reading/passages/${passageId}/progress`, {
    method: 'PUT',
    body: JSON.stringify({ progressPercent })
  });
}

export async function updateReadingBookmark(token: string, passageId: string, bookmarked: boolean): Promise<{ bookmarked: boolean }> {
  return request<{ bookmarked: boolean }>(token, `/v1/reading/passages/${passageId}/bookmark`, {
    method: 'POST',
    body: JSON.stringify({ bookmarked })
  });
}

export async function markReadingWordLearned(token: string, wordId: string): Promise<{ wordId: string; state: 'Known' }> {
  return request<{ wordId: string; state: 'Known' }>(token, `/v1/reading/words/${wordId}/learned`, {
    method: 'POST'
  });
}
