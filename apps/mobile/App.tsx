import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';

import { login, signup } from './src/api/auth-client';
import {
  getForgottenQueue,
  getProgress,
  getReviewQueue,
  getSessionWords,
  getTargetLevel,
  setTargetLevel,
  updateWordState
} from './src/api/learning-client';
import { HomeScreen } from './src/screens/home-screen';
import { LevelSelectScreen } from './src/screens/level-select-screen';
import { LoginScreen } from './src/screens/login-screen';
import { OnboardingScreen } from './src/screens/onboarding-screen';
import { PlacementTestScreen } from './src/screens/placement-test-screen';
import { FavoritesScreen } from './src/screens/favorites-screen';
import { ReadingLibraryScreen } from './src/screens/reading-library-screen';
import { ReadingScreen } from './src/screens/reading-screen';
import { ReviewExercisesScreen } from './src/screens/review-exercises-screen';
import { SearchScreen } from './src/screens/search-screen';
import { TopicBrowserScreen } from './src/screens/topic-browser-screen';
import { ReviewForgottenScreen } from './src/screens/review-forgotten-screen';
import { StatsScreen } from './src/screens/stats-screen';
import { ProfileScreen } from './src/screens/profile-screen';
import { SessionScreen } from './src/screens/session-screen';
import { SessionSummaryScreen } from './src/screens/session-summary-screen';
import { SignupScreen } from './src/screens/signup-screen';
import type { AuthMode } from './src/types/auth';
import type { ForgottenWord, LearningWord, ProgressStats } from './src/types/learning';
import type { CefrLevel, WordState } from './src/types/shared';
import { getOnboardingCompleted, setOnboardingCompleted } from './src/utils/onboarding-storage';
import { addFavoriteWord, clearFavorites, getFavoriteWords, removeFavoriteWord } from './src/utils/favorites-storage';
import { clearSettings, saveSettings } from './src/utils/settings-storage';
import { clearStreak, getStreak, recordStudyActivity } from './src/utils/streak-storage';
import { COLORS } from './src/styles/theme';

type AppView =
  | 'auth-login'
  | 'auth-signup'
  | 'onboarding'
  | 'placement-test'
  | 'home'
  | 'level-select'
  | 'session'
  | 'session-summary'
  | 'review-exercises'
  | 'review-forgotten'
  | 'topics'
  | 'favorites'
  | 'stats'
  | 'profile'
  | 'reading-library'
  | 'reading'
  | 'search';

function validateAuthInput(email: string, password: string): string | null {
  if (!email.trim() || !password.trim()) return 'Please enter both email and password.';
  if (!email.includes('@')) return 'Please enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
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
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [sessionWords, setSessionWords] = useState<LearningWord[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [summary, setSummary] = useState({ known: 0, learning: 0, forgotten: 0 });
  const [forgottenWords, setForgottenWords] = useState<ForgottenWord[]>([]);
  const [forgottenIndex, setForgottenIndex] = useState(0);
  const [reviewWords, setReviewWords] = useState<LearningWord[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<LearningWord[]>([]);
  const [selectedPassageId, setSelectedPassageId] = useState<string | null>(null);

  const refreshDashboard = async (authToken: string) => {
    const [progressResult, targetLevelResult] = await Promise.all([getProgress(authToken), getTargetLevel(authToken)]);
    setProgress(progressResult);
    setSelectedLevel(targetLevelResult.level);
    const streak = await getStreak();
    setStreakDays(streak.currentStreak);
    const favorites = await getFavoriteWords();
    setFavoriteWords(favorites);
    return targetLevelResult.level;
  };

  const resolvePostAuthView = (hasCompletedOnboarding: boolean, level: CefrLevel | null): AppView => {
    if (!hasCompletedOnboarding) return 'onboarding';
    if (!level) return 'level-select';
    return 'home';
  };

  useEffect(() => {
    if (!token) {
      setOnboardingReady(false);
      return;
    }

    void (async () => {
      await getOnboardingCompleted();
      const streak = await getStreak();
      setStreakDays(streak.currentStreak);
      const favorites = await getFavoriteWords();
      setFavoriteWords(favorites);
      setOnboardingReady(true);
    })();
  }, [token]);

  const toggleFavorite = async (word: LearningWord) => {
    const exists = favoriteWords.some((favorite) => favorite.id === word.id);
    if (exists) {
      const updated = await removeFavoriteWord(word.id);
      setFavoriteWords(updated);
      return;
    }
    const updated = await addFavoriteWord(word);
    setFavoriteWords(updated);
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
      const level = await refreshDashboard(authResult.token);
      const completed = await getOnboardingCompleted();
      setOnboardingReady(true);
      setPassword('');
      setView(resolvePostAuthView(completed, level));
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (topic?: string) => {
    if (!token) return;
    try {
      const response = await getSessionWords(token, 20, topic);
      setSessionWords(response.words);
      setSessionIndex(0);
      setSummary({ known: 0, learning: 0, forgotten: 0 });
      setView('session');
    } catch (error: unknown) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  const applyWordState = async (state: WordState) => {
    if (!token) return;
    const current = sessionWords[sessionIndex];
    if (!current) return;

    try {
      await updateWordState(token, current.id, state);
      setSummary((prev) => {
        if (state === 'Known') return { ...prev, known: prev.known + 1 };
        if (state === 'Learning') return { ...prev, learning: prev.learning + 1 };
        return { ...prev, forgotten: prev.forgotten + 1 };
      });

      const nextIndex = sessionIndex + 1;
      if (nextIndex >= sessionWords.length) {
        await recordStudyActivity();
        await refreshDashboard(token);
        setView('session-summary');
        return;
      }

      setSessionIndex(nextIndex);
    } catch (error: unknown) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  const startForgottenReview = async () => {
    if (!token) return;
    try {
      const response = await getForgottenQueue(token, 20);
      setForgottenWords(response.words);
      setForgottenIndex(0);
      setView('review-forgotten');
    } catch (error: unknown) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  const startReviewExercises = async () => {
    if (!token) return;
    try {
      const queue = await getReviewQueue(token, 12);
      if (queue.words.length > 0) {
        setReviewWords(queue.words);
      } else {
        const forgotten = await getForgottenQueue(token, 12);
        if (forgotten.words.length > 0) {
          const mapped = forgotten.words.map((word) => ({ ...word, state: 'Forgotten' as const }));
          setReviewWords(mapped);
        } else {
          const session = await getSessionWords(token, 12);
          setReviewWords(session.words);
        }
      }
      setView('review-exercises');
    } catch (error: unknown) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  const applyForgottenReviewState = async (state: WordState) => {
    if (!token) return;
    const current = forgottenWords[forgottenIndex];
    if (!current) return;

    try {
      await updateWordState(token, current.id, state);

      const nextIndex = forgottenIndex + 1;
      if (nextIndex >= forgottenWords.length) {
        await recordStudyActivity();
        await refreshDashboard(token);
        setView('home');
        return;
      }

      setForgottenIndex(nextIndex);
    } catch (error: unknown) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  const screen = (() => {
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
            try {
              await setTargetLevel(token, level);
              await refreshDashboard(token);
              await setOnboardingCompleted(true);
              setView('home');
            } catch (error: unknown) {
              Alert.alert('Error', getErrorMessage(error));
            }
          }}
          onStartPlacementTest={() => setView('placement-test')}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'onboarding') {
      return (
        <OnboardingScreen
          onGetStarted={async () => {
            await setOnboardingCompleted(true);
            setView('level-select');
          }}
        />
      );
    }

    if (view === 'placement-test') {
      return (
        <PlacementTestScreen
          onComplete={async (level) => {
            if (!token) return;
            try {
              await setTargetLevel(token, level);
              await refreshDashboard(token);
              await setOnboardingCompleted(true);
              setView('home');
            } catch (error: unknown) {
              Alert.alert('Error', getErrorMessage(error));
            }
          }}
          onExit={() => setView('level-select')}
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
          onToggleFavorite={toggleFavorite}
          isFavorite={(wordId) => favoriteWords.some((favorite) => favorite.id === wordId)}
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
          onToggleFavorite={toggleFavorite}
          isFavorite={(wordId) => favoriteWords.some((favorite) => favorite.id === wordId)}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'review-exercises') {
      return (
        <ReviewExercisesScreen
          words={reviewWords}
          onAnswer={async (wordId, correct) => {
            if (!token) return;
            try {
              await updateWordState(token, wordId, correct ? 'Known' : 'Learning');
            } catch (error: unknown) {
              Alert.alert('Error', getErrorMessage(error));
            }
          }}
          onComplete={async () => {
            if (!token) return;
            await recordStudyActivity();
            await refreshDashboard(token);
            setView('home');
          }}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'topics') {
      return (
        <TopicBrowserScreen
          onSelectTopic={(topic) => {
            void startSession(topic);
          }}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'favorites') {
      return (
        <FavoritesScreen
          favorites={favoriteWords}
          onRemove={async (wordId) => {
            const updated = await removeFavoriteWord(wordId);
            setFavoriteWords(updated);
          }}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'reading-library') {
      if (!token) return null;
      return (
        <ReadingLibraryScreen
          token={token}
          onOpenPassage={(passageId) => {
            setSelectedPassageId(passageId);
            setView('reading');
          }}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'reading') {
      if (!token || !selectedPassageId) return null;
      return (
        <ReadingScreen
          token={token}
          passageId={selectedPassageId}
          isFavorite={(wordId) => favoriteWords.some((favorite) => favorite.id === wordId)}
          onToggleFavorite={toggleFavorite}
          onBack={() => setView('reading-library')}
        />
      );
    }

    if (view === 'stats') {
      return (
        <StatsScreen
          progress={progress}
          streakDays={streakDays}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'search') {
      if (!token) return null;
      return (
        <SearchScreen
          token={token}
          favoriteWords={favoriteWords}
          onToggleFavorite={toggleFavorite}
          onBack={() => setView('home')}
        />
      );
    }

    if (view === 'profile') {
      return (
        <ProfileScreen
          email={email}
          level={progress?.level ?? null}
          onUpdateSettings={async (settings) => {
            await saveSettings(settings);
          }}
          onResetProgress={async () => {
            await clearSettings();
            await clearFavorites();
            await clearStreak();
            setProgress(null);
            setSelectedLevel(null);
            setFavoriteWords([]);
            setStreakDays(0);
            if (token) await refreshDashboard(token);
          }}
          onBack={() => setView('home')}
        />
      );
    }

    return (
      <HomeScreen
        progress={progress}
        streakDays={streakDays}
        onOpenLevelSelect={() => setView('level-select')}
        onOpenSession={() => startSession()}
        onOpenForgottenReview={startForgottenReview}
        onOpenReviewExercises={startReviewExercises}
        onOpenTopics={() => setView('topics')}
        onOpenFavorites={() => setView('favorites')}
        onOpenReadingLibrary={() => setView('reading-library')}
        onOpenSearch={() => setView('search')}
        onOpenStats={() => setView('stats')}
        onOpenProfile={() => setView('profile')}
        onRefresh={() => {
          if (!token) return;
          void refreshDashboard(token).catch((error: unknown) => {
            Alert.alert('Error', getErrorMessage(error));
          });
        }}
        onLogout={() => {
          setToken(null);
          setEmail('');
          setPassword('');
          setProgress(null);
          setSelectedLevel(null);
          setSelectedPassageId(null);
          setOnboardingReady(false);
          setMode('login');
          setView('auth-login');
          setErrorMessage(null);
        }}
      />
    );
  })();

  const isFullBleed = view === 'onboarding' || view === 'placement-test';
  const isAuth = view === 'auth-login' || view === 'auth-signup';
  const containerStyle = isFullBleed ? styles.containerFull : (isAuth ? styles.containerCentered : styles.containerPadded);

  if (token && !onboardingReady) {
    return <SafeAreaView style={styles.containerPadded} />;
  }

  return <SafeAreaView style={containerStyle}>{screen}</SafeAreaView>;
}

const styles = StyleSheet.create({
  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20
  },
  containerCentered: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center'
  },
  containerFull: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
