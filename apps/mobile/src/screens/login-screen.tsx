import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to continue learning.</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={styles.input}
        value={props.email}
        onChangeText={props.onChangeEmail}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#555', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 },
  error: { color: '#c0392b', marginTop: 4 },
  button: { backgroundColor: '#111', borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
  switchText: { color: '#2d6cdf', marginTop: 8, textAlign: 'center' }
});
