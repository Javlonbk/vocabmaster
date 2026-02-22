import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SearchWord } from '../types/search';

const SEARCH_CACHE_KEY = 'vocabmaster:search:cache';

export async function cacheSearchResults(results: SearchWord[]): Promise<void> {
  const existing = await getCachedSearchResults();
  const merged = new Map<string, SearchWord>();
  for (const word of existing) {
    merged.set(word.id, word);
  }
  for (const word of results) {
    merged.set(word.id, word);
  }

  await AsyncStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(Array.from(merged.values())));
}

export async function getCachedSearchResults(): Promise<SearchWord[]> {
  const raw = await AsyncStorage.getItem(SEARCH_CACHE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SearchWord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function clearSearchCache(): Promise<void> {
  await AsyncStorage.removeItem(SEARCH_CACHE_KEY);
}
