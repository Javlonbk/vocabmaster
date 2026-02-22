import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';

import { Flashcard } from '../components/flashcard';
import type { ForgottenWord, LearningWord } from '../types/learning';
import type { WordState } from '../types/shared';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type ReviewForgottenScreenProps = {
  word: ForgottenWord | null;
  index: number;
  total: number;
  onMark: (state: WordState) => void;
  onToggleFavorite: (word: LearningWord) => void;
  isFavorite: (wordId: string) => boolean;
  onBack: () => void;
};

export function ReviewForgottenScreen(props: ReviewForgottenScreenProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [props.word?.id]);

  const handleSpeak = () => {
    if (!props.word) return;
    Speech.stop();
    Speech.speak(props.word.text, { language: 'en-US' });
  };

  if (!props.word) {
    return (
      <Screen contentStyle={styles.container}>
        <Text style={styles.emptyText}>No forgotten words right now!</Text>
        <Pressable onPress={props.onBack}><Text style={styles.link}>Back</Text></Pressable>
      </Screen>
    );
  }

  const badge = `${props.word.topic} - ${props.word.partOfSpeech}`;

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={props.onBack} />
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((props.index + 1) / Math.max(props.total, 1)) * 100}%` }]} />
          </View>
          <Text style={styles.progress}>{props.index + 1} / {props.total}</Text>
        </View>
      </View>

      <View style={styles.cardWrap}>
        <Flashcard
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((prev) => !prev)}
          front={
            <View style={styles.faceContent}>
              <View style={styles.badgeRow}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
                <Text style={styles.levelText}>{props.word.level}</Text>
              </View>
              <Text style={styles.word}>{props.word.text}</Text>
              <View style={styles.audioRow}>
                <Text style={styles.phonetic}>{props.word.phonetic}</Text>
                <Pressable style={styles.audioButton} onPress={handleSpeak}>
                  <Text style={styles.audioText}>Play</Text>
                </Pressable>
              </View>
              <Text style={styles.tapHint}>Tap to flip</Text>
            </View>
          }
          back={
            <View style={styles.faceContent}>
              <View style={styles.definitionCard}>
                <Text style={styles.definitionLabel}>Definition</Text>
                <Text style={styles.definition}>{props.word.meaning}</Text>
              </View>
              <View style={styles.exampleCard}>
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.example}>&quot;{props.word.example}&quot;</Text>
              </View>
              <Text style={styles.tapHint}>Tap to flip</Text>
            </View>
          }
        />
      </View>
      <Text style={styles.meta}>Last reviewed: {props.word.lastReviewedAt ?? 'Never'}</Text>
      <Pressable style={styles.primaryButton} onPress={() => props.onMark('Known')}><Text style={styles.primaryText}>Now Known</Text></Pressable>
      <Pressable style={styles.outlineButton} onPress={() => props.onMark('Learning')}><Text style={styles.outlineText}>Still Learning</Text></Pressable>
      <Pressable style={styles.ghostButton} onPress={() => props.onMark('Forgotten')}><Text style={styles.ghostText}>Still Forgotten</Text></Pressable>
      <Pressable onPress={props.onBack}><Text style={styles.link}>Stop Review</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%' },
  progressWrap: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: COLORS.surface, borderRadius: RADII.pill, overflow: 'hidden', ...SHADOWS.card },
  progressFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: RADII.pill },
  progress: { color: COLORS.textMuted, fontSize: 12, marginTop: 6, textAlign: 'center' },
  cardWrap: { width: '100%' },
  faceContent: { alignItems: 'center', gap: 12 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  badgePill: { backgroundColor: COLORS.primarySoft, borderRadius: RADII.pill, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: COLORS.primaryDark, fontWeight: '600', fontSize: 12 },
  levelText: { color: COLORS.textMuted, fontWeight: '600' },
  word: { fontSize: 32, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  phonetic: { color: COLORS.textMuted, fontSize: 16 },
  audioButton: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: RADII.pill },
  audioText: { color: '#fff', fontWeight: '600' },
  definitionCard: { backgroundColor: COLORS.surfaceSoft, borderRadius: RADII.card, padding: 14, width: '100%', gap: 6 },
  definitionLabel: { color: COLORS.textMuted, fontSize: 12, textTransform: 'uppercase' },
  definition: { color: COLORS.text, fontSize: 16 },
  exampleCard: { backgroundColor: COLORS.primarySoft, borderRadius: RADII.card, padding: 14, width: '100%', gap: 6 },
  exampleLabel: { color: COLORS.primaryDark, fontSize: 12, textTransform: 'uppercase' },
  example: { color: COLORS.text, fontStyle: 'italic' },
  tapHint: { color: COLORS.textMuted, fontSize: 12 },
  meta: { color: COLORS.textMuted },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: RADII.input, padding: 14, minWidth: 220, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
  outlineButton: { backgroundColor: COLORS.surface, borderRadius: RADII.input, padding: 14, minWidth: 220, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  outlineText: { color: COLORS.text, fontWeight: '600' },
  ghostButton: { borderRadius: RADII.input, padding: 12, minWidth: 220, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  ghostText: { color: COLORS.textMuted, fontWeight: '600' },
  link: { marginTop: 6, color: COLORS.primaryDark, fontWeight: '600' },
  emptyText: { color: COLORS.textMuted }
});
