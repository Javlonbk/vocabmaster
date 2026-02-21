import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { login, signup } from './src/api/auth-client';
import { HomeScreen } from './src/screens/home-screen';
import { LoginScreen } from './src/screens/login-screen';
import { SignupScreen } from './src/screens/signup-screen';
import type { AuthMode } from './src/types/auth';

function validateAuthInput(email: string, password: string): string | null {
  if (!email.trim() || !password.trim()) {
    return 'Please enter both email and password.';
  }

  if (!email.includes('@')) {
    return 'Please enter a valid email address.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return null;
}

export default function App() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const clearAuthState = () => {
    setErrorMessage(null);
    setLoading(false);
  };

  const submit = async () => {
    const validationError = validateAuthInput(email, password);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = { email: email.trim(), password };
      const authResult = mode === 'login' ? await login(payload) : await signup(payload);
      setToken(authResult.token);
      setPassword('');
    } catch {
      setErrorMessage('Authentication failed. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const screen = useMemo(() => {
    if (token) {
      return (
        <HomeScreen
          token={token}
          onLogout={() => {
            setToken(null);
            setEmail('');
            setPassword('');
            clearAuthState();
            setMode('login');
          }}
        />
      );
    }

    if (mode === 'login') {
      return (
        <LoginScreen
          email={email}
          password={password}
          loading={loading}
          errorMessage={errorMessage}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          onSubmit={submit}
          onSwitchMode={() => {
            setMode('signup');
            clearAuthState();
          }}
        />
      );
    }

    return (
      <SignupScreen
        email={email}
        password={password}
        loading={loading}
        errorMessage={errorMessage}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onSubmit={submit}
        onSwitchMode={() => {
          setMode('login');
          clearAuthState();
        }}
      />
    );
  }, [email, errorMessage, loading, mode, password, token]);

  return <SafeAreaView style={styles.container}>{screen}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center'
  }
});
