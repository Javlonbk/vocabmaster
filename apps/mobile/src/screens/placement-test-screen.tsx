import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import type { PlacementAnswer } from '@vocabmaster/shared';
import { calculateRecommendedLevel, getNextAdaptiveLevel } from '@vocabmaster/shared';

import { placementQuestions, type PlacementQuestion } from '../config/placement-questions';
import type { CefrLevel } from '../types/shared';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type PlacementTestScreenProps = {
  onComplete: (level: CefrLevel) => void;
  onExit: () => void;
};

const TOTAL_QUESTIONS = 12;
const START_LEVEL: CefrLevel = 'B1';

function pickQuestion(level: CefrLevel, askedIds: Set<string>): PlacementQuestion {
  const byLevel = placementQuestions.filter((question) => question.level === level && !askedIds.has(question.id));
  if (byLevel.length > 0) {
    return byLevel[Math.floor(Math.random() * byLevel.length)];
  }

  const remaining = placementQuestions.filter((question) => !askedIds.has(question.id));
  if (remaining.length === 0) {
    return placementQuestions[0];
  }

  return remaining[Math.floor(Math.random() * remaining.length)];
}

export function PlacementTestScreen({ onComplete, onExit }: PlacementTestScreenProps) {
  const [asked, setAsked] = useState<PlacementQuestion[]>(() => [pickQuestion(START_LEVEL, new Set())]);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = asked[currentIndex];
  const currentAnswer = answers[currentIndex];

  const progressLabel = useMemo(
    () => `Question ${currentIndex + 1} of ${TOTAL_QUESTIONS}`,
    [currentIndex]
  );

  const handleExit = () => {
    Alert.alert('Exit placement test?', 'Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: onExit }
    ]);
  };

  const handleAnswer = (index: number) => {
    if (!currentQuestion || currentAnswer) return;

    const correct = index === currentQuestion.correctAnswer;
    const nextAnswers = [...answers, { level: currentQuestion.level, correct }];
    setAnswers(nextAnswers);
    setSelectedIndices((prev) => [...prev, index]);

    if (nextAnswers.length >= TOTAL_QUESTIONS) {
      const recommended = calculateRecommendedLevel(nextAnswers, currentQuestion.level);
      onComplete(recommended);
      return;
    }

    const nextLevel = getNextAdaptiveLevel(currentQuestion.level, correct);
    const askedIds = new Set(asked.map((question) => question.id));
    const nextQuestion = pickQuestion(nextLevel, askedIds);
    setAsked((prev) => [...prev, nextQuestion]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < asked.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <Screen contentStyle={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={handleExit} />
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(currentIndex + 1) / TOTAL_QUESTIONS * 100}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{progressLabel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Placement Test</Text>
          <Text style={styles.question}>What does &quot;{currentQuestion.word}&quot; mean?</Text>
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswer && selectedIndices[currentIndex] === index;
            const isAnswered = Boolean(currentAnswer);
            return (
              <Pressable
                key={option}
                style={[styles.optionButton, isSelected && styles.optionButtonSelected, isAnswered && styles.optionButtonDisabled]}
                onPress={() => handleAnswer(index)}
                disabled={isAnswered}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
              </Pressable>
            );
          })}
          {currentAnswer ? <Text style={styles.answeredHint}>Answer locked. Use Next to continue.</Text> : null}
        </View>

        <View style={styles.nav}>
          <Pressable style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]} onPress={handlePrevious} disabled={currentIndex === 0}>
            <Text style={styles.navText}>Previous</Text>
          </Pressable>
          <Pressable style={[styles.navButton, currentIndex >= asked.length - 1 && styles.navButtonDisabled]} onPress={handleNext} disabled={currentIndex >= asked.length - 1}>
            <Text style={styles.navText}>Next</Text>
          </Pressable>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  progressWrap: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: COLORS.surface, borderRadius: RADII.pill, overflow: 'hidden', ...SHADOWS.card },
  progressFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: RADII.pill },
  progressLabel: { marginTop: 6, color: COLORS.textMuted, fontSize: 12 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.cardLg,
    padding: 20,
    gap: 12,
    ...SHADOWS.card
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  question: {
    fontSize: 16,
    color: COLORS.text
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.input,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary
  },
  optionButtonDisabled: {
    opacity: 0.6
  },
  optionText: {
    color: COLORS.text,
    fontWeight: '500'
  },
  optionTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '600'
  },
  answeredHint: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 12
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  navButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADII.input,
    alignItems: 'center'
  },
  navButtonDisabled: {
    backgroundColor: COLORS.primarySoft
  },
  navText: {
    color: '#fff',
    fontWeight: '600'
  }
});
