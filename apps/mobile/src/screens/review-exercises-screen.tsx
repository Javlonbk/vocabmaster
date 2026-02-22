import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { LearningWord } from '../types/learning';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type ExerciseType = 'multiple-choice' | 'fill-in-blank';

type ReviewExercisesScreenProps = {
  words: LearningWord[];
  onAnswer: (wordId: string, correct: boolean) => Promise<void> | void;
  onComplete: () => void;
  onBack: () => void;
};

function buildOptions(words: LearningWord[], current: LearningWord): string[] {
  const distractors = words.filter((word) => word.id !== current.id).map((word) => word.meaning);
  const unique = Array.from(new Set(distractors)).slice(0, 3);
  const options = [current.meaning, ...unique];
  while (options.length < 4) {
    options.push('None of the above');
  }
  return options.sort(() => Math.random() - 0.5);
}

function buildBlankSentence(word: LearningWord): string {
  const lower = word.example.toLowerCase();
  const target = word.text.toLowerCase();
  if (lower.includes(target)) {
    const regex = new RegExp(word.text, 'gi');
    return word.example.replace(regex, '_____');
  }
  return `Use this word in a sentence: _____ (${word.text})`;
}

export function ReviewExercisesScreen({ words, onAnswer, onComplete, onBack }: ReviewExercisesScreenProps) {
  const [exerciseType, setExerciseType] = useState<ExerciseType>('multiple-choice');
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [lockAnswer, setLockAnswer] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const current = words[index];
  const options = useMemo(() => (current ? buildOptions(words, current) : []), [current, words]);
  const blankSentence = current ? buildBlankSentence(current) : '';

  const handleResult = async (isCorrect: boolean) => {
    if (!current) return;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setLockAnswer(true);
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
    await onAnswer(current.id, isCorrect);
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= words.length) {
      setIsComplete(true);
      return;
    }
    setIndex(nextIndex);
    setFeedback(null);
    setInputValue('');
    setLockAnswer(false);
  };

  if (!current) {
    return (
      <Screen contentStyle={styles.container}>
        <Text style={styles.emptyText}>No words available for review.</Text>
        <Pressable onPress={onBack}><Text style={styles.link}>Back</Text></Pressable>
      </Screen>
    );
  }

  const progress = `${index + 1} / ${words.length}`;
  const accuracy = Math.round((correctCount / Math.max(words.length, 1)) * 100);

  if (isComplete) {
    return (
      <Screen contentStyle={styles.container}>
          <Text style={styles.title}>Review Complete</Text>
          <Text style={styles.summaryText}>Correct: {correctCount} / {words.length}</Text>
          <Text style={styles.summaryText}>Accuracy: {accuracy}%</Text>
          <Pressable style={styles.primaryButton} onPress={onComplete}><Text style={styles.primaryText}>Done</Text></Pressable>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${((index + 1) / Math.max(words.length, 1)) * 100}%` }]} />
            </View>
            <Text style={styles.progress}>{progress}</Text>
          </View>
          <View style={styles.scoreBadge}><Text style={styles.scoreText}>{correctCount}</Text></View>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, exerciseType === 'multiple-choice' && styles.tabActive]}
            onPress={() => {
              setExerciseType('multiple-choice');
              setFeedback(null);
              setLockAnswer(false);
              setInputValue('');
            }}
          >
            <Text style={[styles.tabText, exerciseType === 'multiple-choice' && styles.tabTextActive]}>Multiple Choice</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, exerciseType === 'fill-in-blank' && styles.tabActive]}
            onPress={() => {
              setExerciseType('fill-in-blank');
              setFeedback(null);
              setLockAnswer(false);
              setInputValue('');
            }}
          >
            <Text style={[styles.tabText, exerciseType === 'fill-in-blank' && styles.tabTextActive]}>Fill in Blank</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {exerciseType === 'multiple-choice' ? (
            <>
              <Text style={styles.question}>What does &quot;{current.text}&quot; mean?</Text>
              {options.map((option) => {
                const isCorrect = option === current.meaning;
                const isSelected = feedback && isCorrect;
                return (
                  <Pressable
                    key={option}
                    style={[styles.optionButton, isSelected && styles.optionButtonSelected, lockAnswer && styles.optionButtonDisabled]}
                    onPress={() => {
                      if (!lockAnswer) void handleResult(isCorrect);
                    }}
                    disabled={lockAnswer}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </Pressable>
                );
              })}
            </>
          ) : (
            <>
              <Text style={styles.question}>{blankSentence}</Text>
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Type the missing word"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
                editable={!lockAnswer}
                autoCapitalize="none"
              />
              <Pressable
                style={[styles.primaryButton, lockAnswer && styles.buttonDisabled]}
                onPress={() => {
                  if (lockAnswer) return;
                  const answer = inputValue.trim().toLowerCase();
                  void handleResult(answer === current.text.toLowerCase());
                }}
              >
                <Text style={styles.primaryText}>Check Answer</Text>
              </Pressable>
            </>
          )}
          {feedback ? (
            <View style={[styles.feedback, feedback === 'correct' ? styles.feedbackGood : styles.feedbackBad]}>
              <Text style={styles.feedbackText}>
                {feedback === 'correct' ? 'Correct!' : `Incorrect. Answer: ${current.text}`}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable style={[styles.secondaryButton, !feedback && styles.buttonDisabled]} onPress={handleNext} disabled={!feedback}>
          <Text style={styles.secondaryText}>Next</Text>
        </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressWrap: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: COLORS.surface, borderRadius: RADII.pill, overflow: 'hidden', ...SHADOWS.card },
  progressFill: { height: 8, backgroundColor: COLORS.purple, borderRadius: RADII.pill },
  progress: { color: COLORS.textMuted, fontSize: 12, marginTop: 6, textAlign: 'center' },
  scoreBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', ...SHADOWS.card },
  scoreText: { color: COLORS.textMuted, fontWeight: '600' },
  link: { color: COLORS.primaryDark, fontWeight: '600' },
  tabs: { flexDirection: 'row', gap: 10 },
  tab: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.input, paddingVertical: 10, alignItems: 'center', backgroundColor: COLORS.surface },
  tabActive: { backgroundColor: COLORS.purpleSoft, borderColor: COLORS.purple },
  tabText: { color: COLORS.textMuted, fontWeight: '600' },
  tabTextActive: { color: COLORS.purple },
  card: { backgroundColor: COLORS.surface, borderRadius: RADII.card, padding: 16, gap: 12, ...SHADOWS.card },
  question: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
  optionButton: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.input, padding: 12, backgroundColor: COLORS.surface },
  optionButtonSelected: { backgroundColor: COLORS.purpleSoft, borderColor: COLORS.purple },
  optionButtonDisabled: { opacity: 0.6 },
  optionText: { color: COLORS.text },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.input, padding: 12, color: COLORS.text, backgroundColor: COLORS.surfaceSoft },
  primaryButton: { backgroundColor: COLORS.purple, borderRadius: RADII.input, paddingVertical: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondaryButton: { backgroundColor: COLORS.purple, borderRadius: RADII.input, paddingVertical: 12, alignItems: 'center' },
  secondaryText: { color: '#fff', fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  feedback: { padding: 12, borderRadius: RADII.input },
  feedbackGood: { backgroundColor: COLORS.greenSoft },
  feedbackBad: { backgroundColor: '#fee2e2' },
  feedbackText: { color: COLORS.text, fontWeight: '600' },
  emptyText: { color: COLORS.textMuted },
  summaryText: { color: COLORS.text, fontSize: 16 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text }
});
