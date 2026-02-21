import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CefrLevel } from '../types/shared';

const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

type LevelSelectScreenProps = {
  selectedLevel: CefrLevel | null;
  onSelect: (level: CefrLevel) => void;
  onBack: () => void;
};

export function LevelSelectScreen({ selectedLevel, onSelect, onBack }: LevelSelectScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Target Level</Text>
      {LEVELS.map((level) => (
        <Pressable key={level} style={[styles.levelButton, selectedLevel === level && styles.levelButtonSelected]} onPress={() => onSelect(level)}>
          <Text style={styles.levelText}>{level}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>Back</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', gap: 10 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  levelButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, minWidth: 180, alignItems: 'center' },
  levelButtonSelected: { backgroundColor: '#111', borderColor: '#111' },
  levelText: { color: '#111', fontWeight: '600' },
  backButton: { marginTop: 10 },
  backText: { color: '#2d6cdf' }
});
