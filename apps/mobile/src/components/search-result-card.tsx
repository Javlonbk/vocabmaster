import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';

import type { SearchWord } from '../types/search';
import { COLORS, RADII, SHADOWS } from '../styles/theme';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, query: string): ReactNode {
  if (!query) return <Text>{text}</Text>;
  const safeQuery = escapeRegExp(query);
  const regex = new RegExp(`(${safeQuery})`, 'ig');
  const parts = text.split(regex);
  return (
    <Text>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <Text key={`${part}-${index}`} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          <Text key={`${part}-${index}`}>{part}</Text>
        )
      )}
    </Text>
  );
}

type SearchResultCardProps = {
  word: SearchWord;
  query: string;
  isFavorite: boolean;
  onToggleFavorite: (word: SearchWord) => void;
  onLearn: (word: SearchWord) => void;
};

export function SearchResultCard({ word, query, isFavorite, onToggleFavorite, onLearn }: SearchResultCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.word}>{highlight(word.text, query)}</Text>
          <Text style={styles.meta}>{word.level} - {word.topic} - {word.partOfSpeech}</Text>
        </View>
        <Pressable onPress={() => onToggleFavorite(word)} style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}>
          <Text style={[styles.favoriteText, isFavorite && styles.favoriteTextActive]}>{isFavorite ? 'Saved' : 'Save'}</Text>
        </Pressable>
      </View>
      <Text style={styles.meaning}>{highlight(word.meaning, query)}</Text>
      <Text style={styles.example}>{highlight(word.example, query)}</Text>
      <View style={styles.footer}>
        <View style={styles.tags}>
          <Text style={styles.tag}>{word.state ?? 'Not Started'}</Text>
          <Text style={styles.tag}>{word.mastery}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={() => onLearn(word)}>
            <Text style={styles.actionText}>Learn</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => {
              Speech.stop();
              Speech.speak(word.text, { language: 'en-US' });
            }}
          >
            <Text style={styles.secondaryActionText}>Audio</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADII.card,
    ...SHADOWS.card,
    gap: 8
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  word: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  meta: { color: COLORS.textMuted, marginTop: 4 },
  highlight: { color: COLORS.primary, fontWeight: '700' },
  meaning: { color: COLORS.text },
  example: { color: COLORS.textMuted, fontStyle: 'italic' },
  favoriteButton: { backgroundColor: COLORS.border, paddingVertical: 6, paddingHorizontal: 10, borderRadius: RADII.pill },
  favoriteButtonActive: { backgroundColor: COLORS.orangeSoft },
  favoriteText: { color: COLORS.textMuted, fontWeight: '600' },
  favoriteTextActive: { color: COLORS.orange },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: { backgroundColor: COLORS.border, color: COLORS.textMuted, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADII.pill, fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: { backgroundColor: COLORS.ink, paddingVertical: 6, paddingHorizontal: 10, borderRadius: RADII.input },
  secondaryAction: { backgroundColor: COLORS.primarySoft },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  secondaryActionText: { color: COLORS.primaryDark, fontWeight: '600', fontSize: 12 }
});
