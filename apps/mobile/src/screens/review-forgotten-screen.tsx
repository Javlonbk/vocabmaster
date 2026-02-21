import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ForgottenWord } from '../types/learning';
import type { WordState } from '../types/shared';

type ReviewForgottenScreenProps = {
  word: ForgottenWord | null;
  index: number;
  total: number;
  onMark: (state: WordState) => void;
  onBack: () => void;
};

export function ReviewForgottenScreen({ word, index, total, onMark, onBack }: ReviewForgottenScreenProps) {
  if (!word) {
    return (
      <View style={styles.container}>
        <Text>No forgotten words right now 🎉</Text>
        <Pressable onPress={onBack}><Text style={styles.link}>Back</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{index + 1} / {total}</Text>
      <Text style={styles.word}>{word.text}</Text>
      <Text style={styles.meaning}>{word.meaning}</Text>
      <Text style={styles.meta}>Last reviewed: {word.lastReviewedAt ?? 'Never'}</Text>
      <Pressable style={styles.button} onPress={() => onMark('Known')}><Text style={styles.buttonText}>Now Known</Text></Pressable>
      <Pressable style={styles.button} onPress={() => onMark('Learning')}><Text style={styles.buttonText}>Still Learning</Text></Pressable>
      <Pressable style={styles.button} onPress={() => onMark('Forgotten')}><Text style={styles.buttonText}>Still Forgotten</Text></Pressable>
      <Pressable onPress={onBack}><Text style={styles.link}>Stop Review</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', gap: 10 },
  progress: { color: '#666' },
  word: { fontSize: 30, fontWeight: '700' },
  meaning: { color: '#444' },
  meta: { color: '#777' },
  button: { backgroundColor: '#111', borderRadius: 8, padding: 12, minWidth: 220, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 8, color: '#2d6cdf' }
});
