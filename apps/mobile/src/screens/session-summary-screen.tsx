import { Pressable, StyleSheet, Text, View } from 'react-native';

type SessionSummaryScreenProps = {
  known: number;
  learning: number;
  forgotten: number;
  onBackHome: () => void;
};

export function SessionSummaryScreen({ known, learning, forgotten, onBackHome }: SessionSummaryScreenProps) {
  const total = known + learning + forgotten;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Summary</Text>
      <Text style={styles.stat}>Total: {total}</Text>
      <Text style={styles.stat}>Known: {known}</Text>
      <Text style={styles.stat}>Learning: {learning}</Text>
      <Text style={styles.stat}>Forgotten: {forgotten}</Text>
      <Pressable style={styles.button} onPress={onBackHome}><Text style={styles.buttonText}>Back to Home</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', gap: 10 },
  title: { fontSize: 28, fontWeight: '700' },
  stat: { color: '#222' },
  button: { backgroundColor: '#111', borderRadius: 8, padding: 12, minWidth: 220, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '600' }
});
