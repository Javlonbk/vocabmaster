import AsyncStorage from '@react-native-async-storage/async-storage';

import type { LearningWord } from '../types/learning';

const FAVORITES_KEY = 'vocabmaster:favorites';

export async function getFavoriteWords(): Promise<LearningWord[]> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as LearningWord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function addFavoriteWord(word: LearningWord): Promise<LearningWord[]> {
  const current = await getFavoriteWords();
  if (current.some((item) => item.id === word.id)) return current;
  const updated = [word, ...current];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavoriteWord(wordId: string): Promise<LearningWord[]> {
  const current = await getFavoriteWords();
  const updated = current.filter((item) => item.id !== wordId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(FAVORITES_KEY);
}
