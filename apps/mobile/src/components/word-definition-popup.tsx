import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';

import type { ReadingWord } from '../types/reading';
import { COLORS, RADII, SHADOWS } from '../styles/theme';

type WordDefinitionPopupProps = {
  word: ReadingWord | null;
  visible: boolean;
  position: { left: number; top: number } | null;
  isFavorite: boolean;
  onClose: () => void;
  onMarkLearned: (word: ReadingWord) => void;
  onToggleFavorite: (word: ReadingWord) => void;
};

export function WordDefinitionPopup({
  word,
  visible,
  position,
  isFavorite,
  onClose,
  onMarkLearned,
  onToggleFavorite
}: WordDefinitionPopupProps) {
  if (!visible || !word || !position) return null;

  return (
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Pressable style={[styles.popup, { left: position.left, top: position.top }]} onPress={() => {}}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.word}>{word.text}</Text>
            <Text style={styles.phonetic}>{word.phonetic}</Text>
          </View>
          <Pressable
            style={styles.audioButton}
            onPress={() => {
              Speech.stop();
              Speech.speak(word.text, { language: 'en-US' });
            }}
          >
            <Text style={styles.audioText}>Play</Text>
          </Pressable>
        </View>
        <Text style={styles.definition}>{word.meaning}</Text>
        <Text style={styles.example}>{word.example}</Text>
        <View style={styles.actionRow}>
          <Pressable style={styles.primaryButton} onPress={() => onMarkLearned(word)}>
            <Text style={styles.primaryText}>Mark Learned</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => onToggleFavorite(word)}>
            <Text style={styles.secondaryText}>{isFavorite ? 'Saved' : 'Save'}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.2)'
  },
  popup: {
    position: 'absolute',
    width: 280,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.card,
    padding: 14,
    ...SHADOWS.card
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  word: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  phonetic: { color: COLORS.textMuted, marginTop: 2 },
  audioButton: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.pill
  },
  audioText: { color: COLORS.primaryDark, fontWeight: '600' },
  definition: { color: COLORS.text, marginTop: 10 },
  example: { color: COLORS.textMuted, marginTop: 6, fontStyle: 'italic' },
  actionRow: { marginTop: 12, gap: 8 },
  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 8, borderRadius: RADII.input, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondaryButton: { backgroundColor: COLORS.ink, paddingVertical: 8, borderRadius: RADII.input, alignItems: 'center' },
  secondaryText: { color: '#fff', fontWeight: '600' }
});
