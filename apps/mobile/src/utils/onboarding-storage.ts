import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'vocabmaster:onboarding-complete';

export async function getOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
}

export async function setOnboardingCompleted(value: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, value ? 'true' : 'false');
}
