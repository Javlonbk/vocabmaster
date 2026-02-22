import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ReadingPassageDetail, ReadingPassageSummary } from '../types/reading';

const PASSAGES_CACHE_KEY = 'vocabmaster:reading:passages';
const PASSAGE_DETAIL_PREFIX = 'vocabmaster:reading:passage:';

export async function cacheReadingPassages(passages: ReadingPassageSummary[]): Promise<void> {
  await AsyncStorage.setItem(PASSAGES_CACHE_KEY, JSON.stringify(passages));
}

export async function getCachedReadingPassages(): Promise<ReadingPassageSummary[]> {
  const raw = await AsyncStorage.getItem(PASSAGES_CACHE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReadingPassageSummary[];
  } catch {
    return [];
  }
}

export async function cacheReadingPassage(passage: ReadingPassageDetail): Promise<void> {
  await AsyncStorage.setItem(`${PASSAGE_DETAIL_PREFIX}${passage.id}`, JSON.stringify(passage));
}

export async function getCachedReadingPassage(passageId: string): Promise<ReadingPassageDetail | null> {
  const raw = await AsyncStorage.getItem(`${PASSAGE_DETAIL_PREFIX}${passageId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ReadingPassageDetail;
  } catch {
    return null;
  }
}
