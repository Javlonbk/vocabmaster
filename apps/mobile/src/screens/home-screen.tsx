import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ProgressStats } from '../types/learning';

type HomeScreenProps = {
  progress: ProgressStats | null;
  onOpenLevelSelect: () => void;
  onOpenSession: () => void;
  onOpenForgottenReview: () => void;
  onRefresh: () => void;
  onLogout: () => void;
};

export function HomeScreen({ progress, onOpenLevelSelect, onOpenSession, onOpenForgottenReview, onRefresh, onLogout }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VocabMaster</Text>
      <Text style={styles.subtitle}>Level: {progress?.level ?? 'Not selected'}</Text>
      <Text style={styles.stats}>Tracked: {progress?.totalTracked ?? 0}</Text>
      <Text style={styles.stats}>Known: {progress?.known ?? 0}</Text>
      <Text style={styles.stats}>Learning: {progress?.learning ?? 0}</Text>
      <Text style={styles.stats}>Forgotten: {progress?.forgotten ?? 0}</Text>

      <Pressable style={styles.button} onPress={onOpenLevelSelect}><Text style={styles.buttonText}>Select Level</Text></Pressable>
      <Pressable style={styles.button} onPress={onOpenSession}><Text style={styles.buttonText}>Start Session</Text></Pressable>
      <Pressable style={styles.button} onPress={onOpenForgottenReview}><Text style={styles.buttonText}>Review Forgotten</Text></Pressable>
      <Pressable style={styles.buttonSecondary} onPress={onRefresh}><Text style={styles.buttonText}>Refresh</Text></Pressable>
      <Pressable style={styles.buttonSecondary} onPress={onLogout}><Text style={styles.buttonText}>Logout</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 8, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#555', marginBottom: 6 },
  stats: { color: '#222' },
  button: { backgroundColor: '#111', borderRadius: 8, padding: 12, minWidth: 220, alignItems: 'center', marginTop: 8 },
  buttonSecondary: { backgroundColor: '#444', borderRadius: 8, padding: 12, minWidth: 220, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' }
});
