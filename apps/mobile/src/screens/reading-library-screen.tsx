import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getReadingPassages } from '../api/reading-client';
import { topics } from '../config/topics';
import type { ReadingPassageSummary } from '../types/reading';
import type { CefrLevel } from '../types/shared';
import { cacheReadingPassages, getCachedReadingPassages } from '../utils/reading-storage';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

type ReadingLibraryScreenProps = {
  token: string;
  onOpenPassage: (passageId: string) => void;
  onBack: () => void;
};

export function ReadingLibraryScreen({ token, onOpenPassage, onBack }: ReadingLibraryScreenProps) {
  const [passages, setPassages] = useState<ReadingPassageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<CefrLevel | null>(null);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [offline, setOffline] = useState(false);

  const filteredPassages = useMemo(() => {
    let list = passages;
    if (levelFilter) list = list.filter((passage) => passage.level === levelFilter);
    if (topicFilter) list = list.filter((passage) => passage.topic === topicFilter);
    if (bookmarkedOnly) list = list.filter((passage) => passage.bookmarked);
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter((passage) => passage.title.toLowerCase().includes(query));
    }
    return list;
  }, [passages, levelFilter, topicFilter, bookmarkedOnly, search]);

  useEffect(() => {
    let active = true;

    const fetchPassages = async () => {
      setLoading(true);
      setError(null);
      setOffline(false);

      try {
        const response = await getReadingPassages(token, {
          count: 60,
          level: levelFilter ?? undefined,
          topic: topicFilter ?? undefined,
          search: search.trim() || undefined,
          bookmarked: bookmarkedOnly ? true : undefined
        });
        if (!active) return;
        setPassages(response.passages);
        await cacheReadingPassages(response.passages);
      } catch (err) {
        if (!active) return;
        const cached = await getCachedReadingPassages();
        setPassages(cached);
        setOffline(true);
        setError(err instanceof Error ? err.message : 'Failed to load passages');
      } finally {
        if (active) setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPassages, 250);
    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [token, levelFilter, topicFilter, bookmarkedOnly, search]);

  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.background, COLORS.surface]} style={styles.hero}>
          <View style={styles.headerRow}>
            <BackButton onPress={onBack} />
            <Pressable style={styles.bookmarkToggle} onPress={() => setBookmarkedOnly((prev) => !prev)}>
              <Text style={styles.bookmarkToggleText}>{bookmarkedOnly ? 'All' : 'Saved'}</Text>
            </Pressable>
          </View>
        <Text style={styles.title}>Reading Library</Text>
        <Text style={styles.subtitle}>Pick a passage and learn words in context.</Text>

        <View style={styles.searchWrap}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search passages"
            placeholderTextColor={COLORS.textMuted}
            style={styles.search}
          />
        </View>
      </LinearGradient>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Level</Text>
        <View style={styles.chipRow}>
          {LEVELS.map((level) => (
            <Pressable
              key={level}
              onPress={() => setLevelFilter(levelFilter === level ? null : level)}
              style={[styles.chip, levelFilter === level && styles.chipActive]}
            >
              <Text style={[styles.chipText, levelFilter === level && styles.chipTextActive]}>{level}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Topic</Text>
        <View style={styles.chipRow}>
          {topics.map((topic) => (
            <Pressable
              key={topic.name}
              onPress={() => setTopicFilter(topicFilter === topic.name ? null : topic.name)}
              style={[styles.chip, topicFilter === topic.name && styles.chipActive]}
            >
              <Text style={[styles.chipText, topicFilter === topic.name && styles.chipTextActive]}>{topic.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPassages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{offline ? 'No cached passages available.' : 'No passages match the filters.'}</Text>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => onOpenPassage(item.id)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={[styles.bookmarkBadge, item.bookmarked && styles.bookmarkBadgeActive]}>
                  {item.bookmarked ? 'Saved' : 'Save'}
                </Text>
              </View>
              <Text style={styles.cardMeta}>{item.level} - {item.topic} - {item.estimatedMinutes} min</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.round(item.progressPercent)}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(item.progressPercent)}% read - {item.vocabularyCount} words</Text>
            </Pressable>
          )}
        />
      )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  hero: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20, gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookmarkToggle: { backgroundColor: COLORS.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADII.pill },
  bookmarkToggleText: { color: COLORS.primaryDark, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.textMuted },
  searchWrap: { backgroundColor: COLORS.surface, borderRadius: RADII.input, padding: 2, ...SHADOWS.card },
  search: { backgroundColor: COLORS.surfaceSoft, borderRadius: RADII.input, paddingHorizontal: 12, paddingVertical: 10, color: COLORS.text },
  filterSection: { gap: 10, paddingHorizontal: 20, paddingVertical: 10 },
  filterLabel: { color: COLORS.textMuted, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: RADII.pill, backgroundColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  list: { gap: 14, paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADII.card,
    ...SHADOWS.card,
    gap: 8
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  bookmarkBadge: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  bookmarkBadgeActive: { color: COLORS.warning },
  cardMeta: { color: COLORS.textMuted },
  progressTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: RADII.pill, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: COLORS.primary },
  progressText: { color: COLORS.textMuted, fontSize: 12 },
  loadingWrap: { paddingTop: 40 },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginTop: 20 },
  errorText: { color: COLORS.error, fontSize: 12, textAlign: 'center', paddingBottom: 8 }
});
