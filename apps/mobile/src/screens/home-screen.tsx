import { Pressable, StyleSheet, Text, View } from 'react-native';

type HomeScreenProps = {
  token: string;
  onLogout: () => void;
};

export function HomeScreen({ token, onLogout }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>You are authenticated.</Text>
      <Text style={styles.tokenLabel}>Session token preview:</Text>
      <Text style={styles.token}>{token.slice(0, 24)}...</Text>
      <Pressable style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 12, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#555' },
  tokenLabel: { marginTop: 12, fontWeight: '600' },
  token: { color: '#222' },
  button: { backgroundColor: '#111', borderRadius: 8, padding: 12, minWidth: 140, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});
