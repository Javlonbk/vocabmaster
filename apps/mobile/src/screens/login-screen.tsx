import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS, RADII } from '../styles/theme';
import { API_BASE_URL } from '../config/api';
import { Screen } from '../components/ui/screen';
import { Card } from '../components/ui/card';

type LoginScreenProps = {
  email: string;
  password: string;
  loading: boolean;
  errorMessage: string | null;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  onSwitchMode: () => void;
};

export function LoginScreen(props: LoginScreenProps) {
  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>VM</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue learning.</Text>
        {__DEV__ ? <Text style={styles.debugText}>API: {API_BASE_URL}</Text> : null}
      </View>
      <Card style={styles.card}>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          value={props.email}
          onChangeText={props.onChangeEmail}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          value={props.password}
          onChangeText={props.onChangePassword}
        />
        {props.errorMessage ? <Text style={styles.error}>{props.errorMessage}</Text> : null}
        <Pressable style={[styles.button, props.loading && styles.buttonDisabled]} disabled={props.loading} onPress={props.onSubmit}>
          <Text style={styles.buttonText}>{props.loading ? 'Loading...' : 'Login'}</Text>
        </Pressable>
        <Pressable onPress={props.onSwitchMode}>
          <Text style={styles.switchText}>Need an account? Sign up</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', gap: 16, justifyContent: 'center' },
  hero: { alignItems: 'center', gap: 6 },
  logo: { width: 64, height: 64, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  card: { gap: 12 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.textMuted, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.input,
    padding: 12,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceSoft
  },
  error: { color: COLORS.error, marginTop: 4 },
  button: { backgroundColor: COLORS.primary, borderRadius: RADII.input, padding: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
  switchText: { color: COLORS.primaryDark, marginTop: 8, textAlign: 'center', fontWeight: '600' },
  debugText: { fontSize: 12, color: COLORS.textMuted }
});
