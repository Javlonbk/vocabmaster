import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppSettings = {
  audioEnabled: boolean;
  dailyGoal: number;
  notifications: boolean;
};

const SETTINGS_KEY = 'vocabmaster:settings';

export async function getSettings(): Promise<AppSettings> {
  const stored = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!stored) {
    return { audioEnabled: true, dailyGoal: 10, notifications: false };
  }

  try {
    const parsed = JSON.parse(stored) as AppSettings;
    return {
      audioEnabled: parsed.audioEnabled ?? true,
      dailyGoal: parsed.dailyGoal ?? 10,
      notifications: parsed.notifications ?? false
    };
  } catch {
    return { audioEnabled: true, dailyGoal: 10, notifications: false };
  }
}

export async function saveSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearSettings(): Promise<void> {
  await AsyncStorage.removeItem(SETTINGS_KEY);
}
