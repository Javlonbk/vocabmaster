import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { CefrLevel } from '../types/shared';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';

const LEVELS: Array<{ code: CefrLevel; name: string; description: string; colors: readonly [string, string] }> = [
  { code: 'A1', name: 'Beginner', description: 'Basic words and phrases', colors: ['#4ade80', '#22c55e'] },
  { code: 'A2', name: 'Elementary', description: 'Everyday expressions', colors: ['#60a5fa', '#3b82f6'] },
  { code: 'B1', name: 'Intermediate', description: 'Familiar topics and ideas', colors: ['#c084fc', '#a855f7'] },
  { code: 'B2', name: 'Upper Intermediate', description: 'Complex texts and topics', colors: ['#f472b6', '#ec4899'] },
  { code: 'C1', name: 'Advanced', description: 'Detailed complex subjects', colors: ['#fb923c', '#f97316'] },
  { code: 'C2', name: 'Proficient', description: 'Master-level vocabulary', colors: ['#f87171', '#ef4444'] }
];

type LevelSelectScreenProps = {
  selectedLevel: CefrLevel | null;
  onSelect: (level: CefrLevel) => void;
  onStartPlacementTest: () => void;
  onBack: () => void;
};

export function LevelSelectScreen({ selectedLevel, onSelect, onStartPlacementTest, onBack }: LevelSelectScreenProps) {
  const [currentSelection, setCurrentSelection] = useState<CefrLevel | null>(selectedLevel ?? null);
  useEffect(() => {
    setCurrentSelection(selectedLevel ?? null);
  }, [selectedLevel]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Level</Text>
          <Text style={styles.subtitle}>Select the CEFR level you want to study</Text>
        </View>
        <View style={styles.list}>
          {LEVELS.map((level) => {
            const isSelected = currentSelection === level.code;
            return (
              <Pressable
                key={level.code}
                style={[styles.levelCard, isSelected && styles.levelCardSelected]}
                onPress={() => setCurrentSelection(level.code)}
              >
                <LinearGradient colors={level.colors} style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{level.code}</Text>
                </LinearGradient>
                <View style={styles.levelMeta}>
                  <Text style={styles.levelName}>{level.name}</Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </View>
                {isSelected ? <Text style={styles.levelCheck}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>
        <Pressable
          style={[styles.primaryButton, !currentSelection && styles.buttonDisabled]}
          onPress={() => currentSelection && onSelect(currentSelection)}
        >
          <Text style={styles.primaryText}>Continue →</Text>
        </Pressable>
        <Pressable style={styles.outlineButton} onPress={onStartPlacementTest}>
          <Text style={styles.outlineText}>Take Placement Test</Text>
        </Pressable>
        <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>Back</Text></Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, gap: 14 },
  header: { alignItems: 'center', gap: 6, marginTop: 8 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.textMuted },
  list: { gap: 10, marginTop: 8 },
  levelCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.card,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.card
  },
  levelCardSelected: { borderColor: COLORS.primary },
  levelBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  levelBadgeText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  levelMeta: { flex: 1 },
  levelName: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  levelDescription: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  levelCheck: { color: COLORS.primary, fontWeight: '700', fontSize: 18 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: RADII.input, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryText: { color: '#fff', fontWeight: '600' },
  outlineButton: { backgroundColor: COLORS.surface, borderRadius: RADII.input, paddingVertical: 14, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  outlineText: { color: COLORS.text, fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
  backButton: { alignItems: 'center', marginTop: 4 },
  backText: { color: COLORS.primaryDark, fontWeight: '600' }
});
