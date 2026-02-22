import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { ProgressStats } from '../types/learning';
import { COLORS, RADII, SHADOWS } from '../styles/theme';

type HomeScreenProps = {
  progress: ProgressStats | null;
  streakDays: number;
  onOpenLevelSelect: () => void;
  onOpenSession: () => void;
  onOpenForgottenReview: () => void;
  onOpenReviewExercises: () => void;
  onOpenTopics: () => void;
  onOpenFavorites: () => void;
  onOpenReadingLibrary: () => void;
  onOpenSearch: () => void;
  onOpenStats: () => void;
  onOpenProfile: () => void;
  onRefresh: () => void;
  onLogout: () => void;
};

const ACTIVITY_BARS = [3, 6, 4, 8, 5, 7, 2];
const TOPIC_PROGRESS = [
  { topic: 'Daily Life', progress: 0.4 },
  { topic: 'Business', progress: 0.25 },
  { topic: 'Travel', progress: 0.1 }
];

export function HomeScreen({
  progress,
  streakDays,
  onOpenLevelSelect,
  onOpenSession,
  onOpenForgottenReview,
  onOpenReviewExercises,
  onOpenTopics,
  onOpenFavorites,
  onOpenReadingLibrary,
  onOpenSearch,
  onOpenStats,
  onOpenProfile,
  onRefresh,
  onLogout
}: HomeScreenProps) {
  const today = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);
  const known = progress?.known ?? 0;
  const dueReviews = progress?.dueReviewCount ?? 0;
  const totalTracked = progress?.totalTracked ?? 0;
  const level = progress?.level ?? 'Not selected';
  const progressValue = totalTracked > 0 ? Math.round((known / totalTracked) * 100) : 0;

  return (
    <LinearGradient colors={[COLORS.background, COLORS.surface]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Level {level}</Text>
          </View>
          <Pressable style={styles.levelBadge} onPress={onOpenLevelSelect}>
            <Text style={styles.levelBadgeText}>{level}</Text>
          </Pressable>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{today}</Text>
          <View style={styles.streakCard}>
            <Text style={styles.streakLabel}>Streak</Text>
            <Text style={styles.streakValue}>{streakDays} days</Text>
          </View>
        </View>

        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <Text style={styles.progressValue}>{progressValue}%</Text>
            </View>
            <View style={styles.progressIcon}>
              <Text style={styles.progressIconText}>A+</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressValue}%` }]} />
          </View>
          <Text style={styles.progressFootnote}>{known} of {totalTracked} words learned</Text>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.orangeSoft }]}>
              <Text style={[styles.statIconText, { color: COLORS.orange }]}>★</Text>
            </View>
            <Text style={styles.statValue}>{known}</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.purpleSoft }]}>
              <Text style={[styles.statIconText, { color: COLORS.purple }]}>⏱</Text>
            </View>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {dueReviews > 0 ? (
          <Pressable onPress={onOpenReviewExercises}>
            <LinearGradient colors={[COLORS.purple, '#7c3aed']} style={styles.reviewCard}>
              <View>
                <Text style={styles.reviewLabel}>Review Due Today</Text>
                <Text style={styles.reviewValue}>{dueReviews} words</Text>
              </View>
              <Text style={styles.reviewArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topic Progress</Text>
          {TOPIC_PROGRESS.length > 0 ? (
            <View style={styles.topicList}>
              {TOPIC_PROGRESS.map((item) => (
                <View key={item.topic} style={styles.topicCard}>
                  <View style={styles.topicRow}>
                    <Text style={styles.topicText}>{item.topic}</Text>
                    <Text style={styles.topicMeta}>{Math.round(item.progress * 100)}%</Text>
                  </View>
                  <View style={styles.topicTrack}>
                    <View style={[styles.topicFill, { width: `${Math.round(item.progress * 100)}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Start learning to see your topic progress</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Pressable style={styles.primaryButton} onPress={onOpenSession}>
            <Text style={styles.primaryText}>Continue Learning</Text>
            <Text style={styles.primaryArrow}>→</Text>
          </Pressable>
          <Pressable style={styles.outlineButton} onPress={onOpenReadingLibrary}>
            <Text style={styles.outlineText}>Reading Practice</Text>
            <Text style={styles.outlineArrow}>→</Text>
          </Pressable>
          <Pressable style={styles.outlineButton} onPress={onOpenStats}>
            <Text style={styles.outlineText}>View Statistics</Text>
            <Text style={styles.outlineArrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <Pressable style={styles.quickButton} onPress={onOpenReviewExercises}><Text style={styles.quickText}>Review Words</Text></Pressable>
            <Pressable style={styles.quickButton} onPress={onOpenTopics}><Text style={styles.quickText}>Browse Topics</Text></Pressable>
            <Pressable style={styles.quickButton} onPress={onOpenFavorites}><Text style={styles.quickText}>Favorites</Text></Pressable>
            <Pressable style={styles.quickButton} onPress={onOpenSearch}><Text style={styles.quickText}>Search</Text></Pressable>
            <Pressable style={styles.quickButton} onPress={onOpenProfile}><Text style={styles.quickText}>Profile</Text></Pressable>
            <Pressable style={styles.quickButton} onPress={onOpenForgottenReview}><Text style={styles.quickText}>Forgotten</Text></Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {ACTIVITY_BARS.map((value, index) => (
                <View key={`${index}-${value}`} style={styles.chartBarWrap}>
                  <View style={[styles.chartBar, { height: 12 + value * 10 }]} />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footerActions}>
          <Pressable style={styles.textButton} onPress={onRefresh}><Text style={styles.textButtonText}>Refresh</Text></Pressable>
          <Pressable style={styles.textButton} onPress={onLogout}><Text style={styles.textButtonText}>Logout</Text></Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { width: '100%', gap: 18, padding: 20, paddingBottom: 28 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.textMuted, marginTop: 2 },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card
  },
  levelBadgeText: { color: '#fff', fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaText: { color: COLORS.textMuted },
  streakCard: { backgroundColor: COLORS.surface, paddingVertical: 8, paddingHorizontal: 12, borderRadius: RADII.input, ...SHADOWS.card },
  streakLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  streakValue: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  progressCard: { borderRadius: RADII.cardLg, padding: 20, gap: 12, ...SHADOWS.card },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: '#dbeafe', fontSize: 12 },
  progressValue: { color: '#fff', fontSize: 32, fontWeight: '700' },
  progressIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  progressIconText: { color: '#fff', fontWeight: '700' },
  progressTrack: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: RADII.pill, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#fff', borderRadius: RADII.pill },
  progressFootnote: { color: '#dbeafe', fontSize: 12 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, padding: 14, borderRadius: RADII.card, ...SHADOWS.card, gap: 6 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statIconText: { fontSize: 16, fontWeight: '700' },
  statLabel: { color: COLORS.textMuted, fontSize: 12 },
  statValue: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  reviewCard: {
    borderRadius: RADII.card,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.card
  },
  reviewLabel: { color: '#ede9fe', fontSize: 12 },
  reviewValue: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 4 },
  reviewArrow: { color: '#fff', fontSize: 24 },
  section: { gap: 12 },
  sectionTitle: { color: COLORS.text, fontWeight: '700', fontSize: 18 },
  topicList: { gap: 10 },
  topicCard: { backgroundColor: COLORS.surface, borderRadius: RADII.card, padding: 14, ...SHADOWS.card },
  topicRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  topicText: { color: COLORS.text, fontWeight: '600' },
  topicMeta: { color: COLORS.textMuted, fontSize: 12 },
  topicTrack: { backgroundColor: COLORS.border, borderRadius: RADII.pill, height: 8, overflow: 'hidden' },
  topicFill: { height: 8, backgroundColor: COLORS.primary },
  emptyCard: { backgroundColor: COLORS.surface, borderRadius: RADII.card, padding: 16, ...SHADOWS.card },
  emptyText: { color: COLORS.textMuted, textAlign: 'center' },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.input,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  primaryArrow: { color: '#fff', fontSize: 18 },
  outlineButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.input,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  outlineText: { color: COLORS.text, fontWeight: '600' },
  outlineArrow: { color: COLORS.textMuted },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickButton: { flexBasis: '47%', backgroundColor: COLORS.surface, borderRadius: RADII.input, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  quickText: { color: COLORS.textMuted, fontWeight: '600', fontSize: 12 },
  chartCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: RADII.cardLg, ...SHADOWS.card },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  chartBarWrap: { flex: 1, alignItems: 'center' },
  chartBar: { width: '100%', borderRadius: 6, backgroundColor: '#60a5fa' },
  footerActions: { flexDirection: 'row', justifyContent: 'space-between' },
  textButton: { paddingVertical: 6 },
  textButtonText: { color: COLORS.textMuted, fontWeight: '600' }
});
