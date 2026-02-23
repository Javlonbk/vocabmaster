import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';

import { clampPopupPosition, stripVocabMarkup } from '@vocabmaster/shared';
import { getReadingPassage, markReadingWordLearned, updateReadingBookmark, updateReadingProgress } from '../api/reading-client';
import { ReadingControls } from '../components/reading-controls';
import { ReadingPassage } from '../components/reading-passage';
import { WordDefinitionPopup } from '../components/word-definition-popup';
import type { ReadingPassageDetail, ReadingWord } from '../types/reading';
import type { LearningWord } from '../types/learning';
import { cacheReadingPassage, getCachedReadingPassage } from '../utils/reading-storage';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';

const POPUP_SIZE = { width: 280, height: 220 };

type ReadingScreenProps = {
  token: string;
  passageId: string;
  isFavorite: (wordId: string) => boolean;
  onToggleFavorite: (word: LearningWord) => void;
  onBack: () => void;
};

export function ReadingScreen({ token, passageId, isFavorite, onToggleFavorite, onBack }: ReadingScreenProps) {
  const [passage, setPassage] = useState<ReadingPassageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [selectedWord, setSelectedWord] = useState<ReadingWord | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ left: number; top: number } | null>(null);
  const [showVocabList, setShowVocabList] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPassage = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getReadingPassage(token, passageId);
        if (!active) return;
        setPassage(response);
        setProgressPercent(response.progressPercent);
        setBookmarked(response.bookmarked);
        await cacheReadingPassage(response);
      } catch (err) {
        if (!active) return;
        const cached = await getCachedReadingPassage(passageId);
        if (cached) {
          setPassage(cached);
          setProgressPercent(cached.progressPercent);
          setBookmarked(cached.bookmarked);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load passage');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchPassage();
    return () => {
      active = false;
    };
  }, [token, passageId]);

  const vocabulary = useMemo(() => passage?.vocabulary ?? [], [passage]);
  const toLearningWord = (word: ReadingWord): LearningWord => ({ ...word, state: null });

  const handleSelectWord = (wordText: string, anchorX: number, anchorY: number) => {
    if (!passage) return;
    const word = passage.vocabulary.find((item) => item.text.toLowerCase() === wordText.toLowerCase());
    if (!word) return;

    const { width, height } = Dimensions.get('window');
    const placement = clampPopupPosition({
      anchorX,
      anchorY,
      popupWidth: POPUP_SIZE.width,
      popupHeight: POPUP_SIZE.height,
      screenWidth: width,
      screenHeight: height,
      margin: 12
    });

    setSelectedWord(word);
    setPopupPosition(placement);
  };

  const handleProgressUpdate = async () => {
    if (!passage) return;
    try {
      await updateReadingProgress(token, passage.id, progressPercent);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update progress');
    }
  };

  const handleBack = async () => {
    await handleProgressUpdate();
    onBack();
  };

  const handleToggleBookmark = async () => {
    if (!passage) return;
    const next = !bookmarked;
    setBookmarked(next);
    try {
      await updateReadingBookmark(token, passage.id, next);
    } catch (err) {
      setBookmarked(!next);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update bookmark');
    }
  };

  const handleMarkLearned = async (word: ReadingWord) => {
    try {
      await markReadingWordLearned(token, word.id);
      setSelectedWord(null);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update word');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (!passage) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Passage unavailable.'}</Text>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Screen contentStyle={styles.container}>
      <ReadingControls
        title={passage.title}
        level={passage.level}
        topic={passage.topic}
        estimatedMinutes={passage.estimatedMinutes}
        progressPercent={progressPercent}
        bookmarked={bookmarked}
        onBack={handleBack}
        onToggleBookmark={handleToggleBookmark}
        onPlayAudio={() => {
          Speech.stop();
          Speech.speak(stripVocabMarkup(passage.content), { language: 'en-US' });
        }}
        onOpenVocabulary={() => setShowVocabList(true)}
      />

      <View style={styles.passageCard}>
        <ScrollView
          style={styles.scroll}
          onScroll={(event) => {
            const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
            const maxScroll = Math.max(contentSize.height - layoutMeasurement.height, 1);
            const percent = Math.min(100, Math.max(0, (contentOffset.y / maxScroll) * 100));
            setProgressPercent(percent);
          }}
          onScrollEndDrag={handleProgressUpdate}
          scrollEventThrottle={16}
        >
          <ReadingPassage content={passage.content} onSelectWord={handleSelectWord} />
        </ScrollView>
      </View>

      <WordDefinitionPopup
        word={selectedWord}
        visible={Boolean(selectedWord)}
        position={popupPosition}
        isFavorite={selectedWord ? isFavorite(selectedWord.id) : false}
        onClose={() => setSelectedWord(null)}
        onMarkLearned={handleMarkLearned}
        onToggleFavorite={(word) => onToggleFavorite(toLearningWord(word))}
      />

      <Modal visible={showVocabList} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vocabulary</Text>
              <Pressable onPress={() => setShowVocabList(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.vocabList}>
              {vocabulary.map((word) => (
                <View key={word.id} style={styles.vocabItem}>
                  <View>
                    <Text style={styles.vocabWord}>{word.text}</Text>
                    <Text style={styles.vocabMeaning}>{word.meaning}</Text>
                  </View>
                  <Pressable onPress={() => onToggleFavorite(toLearningWord(word))}>
                    <Text style={styles.vocabFavorite}>{isFavorite(word.id) ? 'Saved' : 'Save'}</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  passageCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.cardLg,
    padding: 16,
    ...SHADOWS.card
  },
  scroll: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { color: COLORS.error },
  backButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.primary, borderRadius: 10 },
  backText: { color: '#fff', fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.4)'
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderTopLeftRadius: RADII.cardLg,
    borderTopRightRadius: RADII.cardLg,
    maxHeight: '70%'
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  modalClose: { color: COLORS.primary, fontWeight: '600' },
  vocabList: { gap: 12, paddingBottom: 20 },
  vocabItem: {
    backgroundColor: COLORS.surfaceSoft,
    padding: 12,
    borderRadius: RADII.input,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  vocabWord: { fontWeight: '700', color: COLORS.text },
  vocabMeaning: { color: COLORS.textMuted, marginTop: 4 },
  vocabFavorite: { fontSize: 12, color: COLORS.warning, fontWeight: '700' }
});
