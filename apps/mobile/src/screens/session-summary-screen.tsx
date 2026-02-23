import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, RADII } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { Card } from '../components/ui/card';

type SessionSummaryScreenProps = {
  known: number;
  learning: number;
  forgotten: number;
  onBackHome: () => void;
};

export function SessionSummaryScreen({ known, learning, forgotten, onBackHome }: SessionSummaryScreenProps) {
  const total = known + learning + forgotten;

  return (
    <Screen contentStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Session Summary</Text>
        <Text style={styles.stat}>Total: {total}</Text>
        <Text style={styles.stat}>Known: {known}</Text>
        <Text style={styles.stat}>Learning: {learning}</Text>
        <Text style={styles.stat}>Forgotten: {forgotten}</Text>
        <Pressable style={styles.button} onPress={onBackHome}><Text style={styles.buttonText}>Back to Home</Text></Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10 },
  card: { width: '100%', alignItems: 'center', gap: 10 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  stat: { color: COLORS.textMuted },
  button: { backgroundColor: COLORS.primary, borderRadius: RADII.input, padding: 12, minWidth: 220, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '600' }
});
