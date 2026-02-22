import AsyncStorage from '@react-native-async-storage/async-storage';

type StreakState = {
  currentStreak: number;
  lastStudyDate: string | null;
};

const STREAK_KEY = 'vocabmaster:streak';

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function diffDays(a: string, b: string): number {
  const first = new Date(a);
  const second = new Date(b);
  const diffMs = second.getTime() - first.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export async function getStreak(): Promise<StreakState> {
  const stored = await AsyncStorage.getItem(STREAK_KEY);
  if (!stored) return { currentStreak: 0, lastStudyDate: null };

  try {
    const parsed = JSON.parse(stored) as StreakState;
    return {
      currentStreak: parsed.currentStreak ?? 0,
      lastStudyDate: parsed.lastStudyDate ?? null
    };
  } catch {
    return { currentStreak: 0, lastStudyDate: null };
  }
}

export async function recordStudyActivity(referenceDate: Date = new Date()): Promise<StreakState> {
  const current = await getStreak();
  const today = toDateString(referenceDate);

  if (!current.lastStudyDate) {
    const updated = { currentStreak: 1, lastStudyDate: today };
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
  }

  const daysSince = diffDays(current.lastStudyDate, today);
  let nextStreak = current.currentStreak;

  if (daysSince === 0) {
    return current;
  }

  if (daysSince === 1) {
    nextStreak += 1;
  } else {
    nextStreak = 1;
  }

  const updated = { currentStreak: nextStreak, lastStudyDate: today };
  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearStreak(): Promise<void> {
  await AsyncStorage.removeItem(STREAK_KEY);
}
