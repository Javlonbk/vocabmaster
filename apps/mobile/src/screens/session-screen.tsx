import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';

import { Flashcard } from '../components/flashcard';
import type { LearningWord } from '../types/learning';
import type { WordState } from '../types/shared';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type SessionScreenProps = {
  word: LearningWord | null;
  index: number;
  total: number;
  onMark: (state: WordState) => void;
  onToggleFavorite: (word: LearningWord) => void;
  isFavorite: (wordId: string) => boolean;
  onBack: () => void;
};

export function SessionScreen({ word, index, total, onMark, onToggleFavorite, isFavorite, onBack }: SessionScreenProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const swipeX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsFlipped(false);
    swipeX.setValue(0);
  }, [word?.id, swipeX]);

  const handleSpeak = () => {
    if (!word) return;
    Speech.stop();
    Speech.speak(word.text, { language: 'en-US' });
  };

  const handleMark = useCallback(
    (state: WordState) => {
      setIsFlipped(false);
      swipeX.setValue(0);
      onMark(state);
    },
    [onMark, swipeX]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dx) > 12,
        onPanResponderMove: Animated.event([null, { dx: swipeX }], { useNativeDriver: false }),
        onPanResponderRelease: (_evt, gesture) => {
          if (gesture.dx > 80) {
            handleMark('Known');
            return;
          }
          if (gesture.dx < -80) {
            handleMark('Learning');
            return;
          }
          Animated.spring(swipeX, { toValue: 0, useNativeDriver: false }).start();
        }
      }),
    [handleMark, swipeX]
  );

  if (!word) {
    return (
      <Screen contentStyle={styles.container}>
        <Text style={styles.emptyText}>No words available for this level.</Text>
        <Pressable onPress={onBack}><Text style={styles.link}>Back</Text></Pressable>
      </Screen>
    );
  }

  const badge = `${word.topic} - ${word.partOfSpeech}`;

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((index + 1) / Math.max(total, 1)) * 100}%` }]} />
          </View>
          <Text style={styles.progress}>{index + 1} / {total}</Text>
        </View>
        <Pressable style={styles.favoriteButton} onPress={() => onToggleFavorite(word)}>
          <Text style={styles.favoriteText}>{isFavorite(word.id) ? 'Saved' : 'Save'}</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.cardWrap, { transform: [{ translateX: swipeX }] }]} {...panResponder.panHandlers}>
        <Flashcard
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((prev) => !prev)}
          front={
            <View style={styles.faceContent}>
              <View style={styles.badgeRow}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
                <Text style={styles.levelText}>{word.level}</Text>
              </View>
              <Text style={styles.word}>{word.text}</Text>
              <View style={styles.audioRow}>
                <Text style={styles.phonetic}>{word.phonetic}</Text>
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
                <Text style={styles.definition}>{word.meaning}</Text>
              </View>
              <View style={styles.exampleCard}>
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.example}>&quot;{word.example}&quot;</Text>
              </View>
              <Text style={styles.tapHint}>Tap to flip</Text>
            </View>
          }
        />
      </Animated.View>

      <View style={styles.actions}>
        <Pressable style={styles.outlineButton} onPress={() => handleMark('Learning')}>
          <Text style={styles.outlineText}>Still Learning</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => handleMark('Known')}>
          <Text style={styles.primaryText}>I Know This</Text>
        </Pressable>
        <Pressable style={styles.ghostButton} onPress={() => handleMark('Forgotten')}>
          <Text style={styles.ghostText}>Forgotten</Text>
        </Pressable>
      </View>

      <Text style={styles.swipeHint}>Swipe right = Known, left = Learning</Text>
      <Pressable onPress={onBack}><Text style={styles.link}>Cancel Session</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%' },
  favoriteButton: { backgroundColor: COLORS.border, borderRadius: RADII.pill, paddingHorizontal: 10, paddingVertical: 6 },
  favoriteText: { color: COLORS.textMuted, fontWeight: '600', fontSize: 12 },
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
  word: { fontSize: 36, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
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
  actions: { width: '100%', gap: 10, marginTop: 8 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: RADII.input, padding: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
  outlineButton: { backgroundColor: COLORS.surface, borderRadius: RADII.input, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  outlineText: { color: COLORS.text, fontWeight: '600' },
  ghostButton: { borderRadius: RADII.input, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  ghostText: { color: COLORS.textMuted, fontWeight: '600' },
  swipeHint: { color: COLORS.textMuted, fontSize: 12 },
  link: { marginTop: 6, color: COLORS.primaryDark, fontWeight: '600' },
  emptyText: { color: COLORS.textMuted }
});
