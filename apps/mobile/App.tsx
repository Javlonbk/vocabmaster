import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { login, signup } from './src/api/auth-client';
import {
  getForgottenQueue,
  getProgress,
  getSessionWords,
  getTargetLevel,
  setTargetLevel,
  updateWordState
} from './src/api/learning-client';
import { HomeScreen } from './src/screens/home-screen';
import { LevelSelectScreen } from './src/screens/level-select-screen';
import { LoginScreen } from './src/screens/login-screen';
import { ReviewForgottenScreen } from './src/screens/review-forgotten-screen';
import { SessionScreen } from './src/screens/session-screen';
import { SessionSummaryScreen } from './src/screens/session-summary-screen';
import { SignupScreen } from './src/screens/signup-screen';
import type { AuthMode } from './src/types/auth';
import type { ForgottenWord, LearningWord, ProgressStats } from './src/types/learning';
import type { CefrLevel, WordState } from './src/types/shared';

type AppView = 'auth-login' | 'auth-signup' | 'home' | 'level-select' | 'session' | 'session-summary' | 'review-forgotten';

function validateAuthInput(email: string, password: string): string | null {
  if (!email.trim() || !password.trim()) return 'Please enter both email and password.';
  if (!email.includes('@')) return 'Please enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

export default function App() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [view, setView] = useState<AppView>('auth-login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | null>(null);
  const [sessionWords, setSessionWords] = useState<LearningWord[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [summary, setSummary] = useState({ known: 0, learning: 0, forgotten: 0 });
  const [forgottenWords, setForgottenWords] = useState<ForgottenWord[]>([]);
  const [forgottenIndex, setForgottenIndex] = useState(0);

  const refreshDashboard = async (authToken: string) => {
    const [progressResult, targetLevelResult] = await Promise.all([getProgress(authToken), getTargetLevel(authToken)]);
    setProgress(progressResult);
    setSelectedLevel(targetLevelResult.level);
  };

  const submitAuth = async () => {
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
      await refreshDashboard(authResult.token);
      setPassword('');
      setView('home');
    } catch {
      setErrorMessage('Authentication failed. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    if (!token) return;
    const response = await getSessionWords(token, 20);
    setSessionWords(response.words);
    setSessionIndex(0);
    setSummary({ known: 0, learning: 0, forgotten: 0 });
    setView('session');
  };

  const applyWordState = async (state: WordState) => {
    if (!token) return;
    const current = sessionWords[sessionIndex];
    if (!current) return;

    await updateWordState(token, current.id, state);
    setSummary((prev) => {
      if (state === 'Known') return { ...prev, known: prev.known + 1 };
      if (state === 'Learning') return { ...prev, learning: prev.learning + 1 };
      return { ...prev, forgotten: prev.forgotten + 1 };
    });

    const nextIndex = sessionIndex + 1;
    if (nextIndex >= sessionWords.length) {
      await refreshDashboard(token);
      setView('session-summary');
      return;
    }

    setSessionIndex(nextIndex);
  };

  const startForgottenReview = async () => {
    if (!token) return;
    const response = await getForgottenQueue(token, 20);
    setForgottenWords(response.words);
    setForgottenIndex(0);
    setView('review-forgotten');
  };

  const applyForgottenReviewState = async (state: WordState) => {
    if (!token) return;
    const current = forgottenWords[forgottenIndex];
    if (!current) return;

    await updateWordState(token, current.id, state);

    const nextIndex = forgottenIndex + 1;
    if (nextIndex >= forgottenWords.length) {
      await refreshDashboard(token);
      setView('home');
      return;
    }

    setForgottenIndex(nextIndex);
  };

  const screen = useMemo(() => {
    if (view === 'auth-login') {
      return (
        <LoginScreen
          email={email}
          password={password}
          loading={loading}
          errorMessage={errorMessage}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          onSubmit={submitAuth}
          onSwitchMode={() => {
            setMode('signup');
            setView('auth-signup');
            setErrorMessage(null);
          }}
        />
      );
    }

    if (view === 'auth-signup') {
      return (
        <SignupScreen
          email={email}
          password={password}
          loading={loading}
          errorMessage={errorMessage}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          onSubmit={submitAuth}
          onSwitchMode={() => {
            setMode('login');
            setView('auth-login');
            setErrorMessage(null);
          }}
        />
      );
    }

    if (view === 'level-select') {
      return (
        <LevelSelectScreen
          selectedLevel={selectedLevel}
          onSelect={async (level) => {
            if (!token) return;
            await setTargetLevel(token, level);
            await refreshDashboard(token);
            setView('home');
          }}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'session') {
      return (
        <SessionScreen
          word={sessionWords[sessionIndex] ?? null}
          index={sessionIndex}
          total={sessionWords.length}
          onMark={applyWordState}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'session-summary') {
      return <SessionSummaryScreen known={summary.known} learning={summary.learning} forgotten={summary.forgotten} onBackHome={() => setView('home')} />;
    }

    if (view === 'review-forgotten') {
      return (
        <ReviewForgottenScreen
          word={forgottenWords[forgottenIndex] ?? null}
          index={forgottenIndex}
          total={forgottenWords.length}
          onMark={applyForgottenReviewState}
          onBack={() => setView('home')}
        />
      );
    }

    return (
      <HomeScreen
        progress={progress}
        onOpenLevelSelect={() => setView('level-select')}
        onOpenSession={startSession}
        onOpenForgottenReview={startForgottenReview}
        onRefresh={() => {
          if (!token) return;
          void refreshDashboard(token);
        }}
        onLogout={() => {
          setToken(null);
          setEmail('');
          setPassword('');
          setProgress(null);
          setSelectedLevel(null);
          setMode('login');
          setView('auth-login');
          setErrorMessage(null);
        }}
      />
    );
  }, [email, errorMessage, forgottenIndex, forgottenWords, loading, mode, password, progress, selectedLevel, sessionIndex, sessionWords, summary, token, view]);

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
