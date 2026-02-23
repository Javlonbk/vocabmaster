import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
type OnboardingScreenProps = {
  onGetStarted: () => void;
};

const HIGHLIGHTS = [
  { title: 'CEFR-Based Learning', description: 'Learn vocabulary from A1 to C2 levels.', icon: 'A1' },
  { title: 'Structured Progress', description: 'Track your learning with detailed statistics.', icon: '✓' },
  { title: 'Daily Practice', description: 'Build consistency with daily streak tracking.', icon: '⏱' },
  { title: 'Topic-Based', description: 'Master vocabulary by practical topics.', icon: '★' }
];

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>VM</Text>
        </View>
        <Text style={styles.title}>VocabMaster</Text>
        <Text style={styles.subtitle}>Master English vocabulary from beginner to advanced.</Text>
      </View>

      <View style={styles.card}>
        {HIGHLIGHTS.map((item) => (
          <View key={item.title} style={styles.highlight}>
            <View style={styles.iconBubble}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>
            <View style={styles.highlightBody}>
              <Text style={styles.highlightTitle}>{item.title}</Text>
              <Text style={styles.highlightDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.ctaButton} onPress={onGetStarted}>
        <Text style={styles.ctaText}>Get Started</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    justifyContent: 'space-between'
  },
  hero: {
    gap: 10,
    alignItems: 'center'
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  logoText: { color: '#fff', fontWeight: '700', fontSize: 20 },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.text
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    textAlign: 'center'
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.cardLg,
    padding: 20,
    gap: 16,
    ...SHADOWS.card
  },
  highlight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: { color: COLORS.primaryDark, fontWeight: '700' },
  highlightBody: { flex: 1, gap: 4 },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text
  },
  highlightDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.input,
    paddingVertical: 16,
    alignItems: 'center'
  },
  ctaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});
