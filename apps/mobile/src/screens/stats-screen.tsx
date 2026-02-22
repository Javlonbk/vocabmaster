import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { ProgressStats } from '../types/learning';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type StatsScreenProps = {
  progress: ProgressStats | null;
  streakDays: number;
  onBack: () => void;
};

const ACTIVITY_SERIES = [2, 4, 7, 3, 6, 5, 4];
const LEVEL_ACCURACY = [
  { level: 'A1', value: 92 },
  { level: 'A2', value: 86 },
  { level: 'B1', value: 79 },
  { level: 'B2', value: 73 },
  { level: 'C1', value: 65 },
  { level: 'C2', value: 58 }
];

export function StatsScreen({ progress, streakDays, onBack }: StatsScreenProps) {
  const totalLearned = progress?.known ?? 0;
  const totalTracked = progress?.totalTracked ?? 0;
  const accuracy = useMemo(() => {
    if (!progress || progress.totalTracked === 0) return 0;
    return Math.round((progress.known / progress.totalTracked) * 100);
  }, [progress]);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.title}>Statistics</Text>
        </View>

        <View style={styles.overviewGrid}>
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalTracked}</Text>
            <Text style={styles.metricLabel}>Vocabulary Size</Text>
          </LinearGradient>
          <LinearGradient colors={[COLORS.green, '#16a34a']} style={styles.metricCard}>
            <Text style={styles.metricValue}>{accuracy}%</Text>
            <Text style={styles.metricLabel}>Retention Rate</Text>
          </LinearGradient>
          <LinearGradient colors={[COLORS.purple, '#7c3aed']} style={styles.metricCard}>
            <Text style={styles.metricValue}>{streakDays}</Text>
            <Text style={styles.metricLabel}>Day Streak</Text>
          </LinearGradient>
          <LinearGradient colors={[COLORS.orange, '#ea580c']} style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalLearned}</Text>
            <Text style={styles.metricLabel}>Words Learned</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.chartRow}>
            {ACTIVITY_SERIES.map((value, index) => (
              <View key={`${index}-${value}`} style={styles.chartBarWrap}>
                <View style={[styles.chartBar, { height: 10 + value * 12 }]} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accuracy by Level</Text>
          {LEVEL_ACCURACY.map((item) => (
            <View key={item.level} style={styles.levelRow}>
              <Text style={styles.levelLabel}>{item.level}</Text>
              <View style={styles.levelTrack}>
                <View style={[styles.levelFill, { width: `${item.value}%` }]} />
              </View>
              <Text style={styles.levelValue}>{item.value}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Current Level</Text>
            <Text style={styles.summaryValue}>{progress?.level ?? '-'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Words to Review</Text>
            <Text style={styles.summaryValue}>{progress?.dueReviewCount ?? 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completion Rate</Text>
            <Text style={styles.summaryValue}>{accuracy}%</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { flexBasis: '47%', borderRadius: RADII.card, padding: 16, gap: 6, ...SHADOWS.card },
  metricValue: { color: '#fff', fontSize: 24, fontWeight: '700' },
  metricLabel: { color: '#e0f2fe', fontSize: 12 },
  section: { backgroundColor: COLORS.surface, borderRadius: RADII.cardLg, padding: 16, gap: 12, ...SHADOWS.card },
  sectionTitle: { color: COLORS.text, fontWeight: '700' },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  chartBarWrap: { flex: 1, alignItems: 'center' },
  chartBar: { width: '100%', borderRadius: 6, backgroundColor: '#60a5fa' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelLabel: { width: 32, color: COLORS.textMuted, fontWeight: '600' },
  levelTrack: { flex: 1, height: 8, borderRadius: RADII.pill, backgroundColor: COLORS.border, overflow: 'hidden' },
  levelFill: { height: 8, backgroundColor: COLORS.primary },
  levelValue: { width: 44, textAlign: 'right', color: COLORS.textMuted, fontSize: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: COLORS.textMuted },
  summaryValue: { color: COLORS.text, fontWeight: '600' }
});
