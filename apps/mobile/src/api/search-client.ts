import { API_BASE_URL } from '../config/api';
import type { SearchFiltersResponse, SearchSort, SearchWord } from '../types/search';
import type { CefrLevel, WordState } from '../types/shared';
import type { MasteryLabel } from '../types/search';

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

export async function searchWords(
  token: string,
  options: {
    query?: string;
    levels?: CefrLevel[];
    topics?: string[];
    partsOfSpeech?: string[];
    states?: Array<WordState | 'NotStarted'>;
    mastery?: MasteryLabel[];
    sort?: SearchSort;
    page?: number;
    count?: number;
  }
): Promise<{ results: SearchWord[]; total: number; page: number; count: number; hasMore: boolean }>{
  const params = new URLSearchParams();
  if (options.query) params.set('q', options.query);
  if (options.levels?.length) params.set('levels', options.levels.join(','));
  if (options.topics?.length) params.set('topics', options.topics.join(','));
  if (options.partsOfSpeech?.length) params.set('parts', options.partsOfSpeech.join(','));
  if (options.states?.length) params.set('states', options.states.join(','));
  if (options.mastery?.length) params.set('mastery', options.mastery.join(','));
  if (options.sort) params.set('sort', options.sort);
  if (options.page) params.set('page', String(options.page));
  if (options.count) params.set('count', String(options.count));

  const query = params.toString();
  return request<{ results: SearchWord[]; total: number; page: number; count: number; hasMore: boolean }>(
    token,
    `/v1/words/search${query ? `?${query}` : ''}`
  );
}

export async function getSearchFilters(token: string): Promise<SearchFiltersResponse> {
  return request<SearchFiltersResponse>(token, '/v1/words/filters');
}
