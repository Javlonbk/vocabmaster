import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { searchWords, getSearchFilters } from '../api/search-client';
import { FilterBadge } from '../components/filter-badge';
import { FilterModal } from '../components/filter-modal';
import { SearchBar } from '../components/search-bar';
import { SearchResultCard } from '../components/search-result-card';
import { SortPicker } from '../components/sort-picker';
import { topics } from '../config/topics';
import type { LearningWord } from '../types/learning';
import type { SearchFilters, SearchFiltersResponse, SearchSort, SearchWord } from '../types/search';
import { cacheSearchResults, getCachedSearchResults } from '../utils/search-storage';
import { updateWordState } from '../api/learning-client';
import { COLORS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

const DEFAULT_FILTERS: SearchFilters = {
  levels: [],
  topics: [],
  partsOfSpeech: [],
  states: [],
  mastery: []
};

const DEFAULT_SORT: SearchSort = 'alphabetical_asc';

function applyLocalFilters(words: SearchWord[], query: string, filters: SearchFilters): SearchWord[] {
  let list = words;
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter((word) =>
      word.text.toLowerCase().includes(q) ||
      word.meaning.toLowerCase().includes(q) ||
      word.example.toLowerCase().includes(q)
    );
  }
  if (filters.levels.length) list = list.filter((word) => filters.levels.includes(word.level));
  if (filters.topics.length) list = list.filter((word) => filters.topics.includes(word.topic));
  if (filters.partsOfSpeech.length) list = list.filter((word) => filters.partsOfSpeech.includes(word.partOfSpeech));
  if (filters.states.length) {
    list = list.filter((word) => {
      const state = word.state ?? 'NotStarted';
      return filters.states.includes(state);
    });
  }
  if (filters.mastery.length) {
    list = list.filter((word) => filters.mastery.includes(word.mastery));
  }
  return list;
}

function sortLocal(words: SearchWord[], sort: SearchSort): SearchWord[] {
  const list = [...words];
  list.sort((a, b) => {
    switch (sort) {
      case 'alphabetical_desc':
        return a.text < b.text ? 1 : -1;
      case 'alphabetical_asc':
        return a.text > b.text ? 1 : -1;
      case 'level_asc':
        return a.level > b.level ? 1 : -1;
      case 'level_desc':
        return a.level < b.level ? 1 : -1;
      case 'learned_desc':
        return (a.learnedAt ?? '') < (b.learnedAt ?? '') ? 1 : -1;
      case 'learned_asc':
        return (a.learnedAt ?? '') > (b.learnedAt ?? '') ? 1 : -1;
      case 'frequency_desc':
        return a.frequency < b.frequency ? 1 : -1;
      case 'frequency_asc':
        return a.frequency > b.frequency ? 1 : -1;
      case 'accuracy_desc':
        return a.accuracy < b.accuracy ? 1 : -1;
      case 'accuracy_asc':
        return a.accuracy > b.accuracy ? 1 : -1;
      default:
        return 0;
    }
  });
  return list;
}

type SearchScreenProps = {
  token: string;
  favoriteWords: LearningWord[];
  onToggleFavorite: (word: LearningWord) => void;
  onBack: () => void;
};

export function SearchScreen({ token, favoriteWords, onToggleFavorite, onBack }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SearchSort>(DEFAULT_SORT);
  const [options, setOptions] = useState<SearchFiltersResponse | null>(null);
  const [results, setResults] = useState<SearchWord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [offline, setOffline] = useState(false);

  const activeFilterCount = filters.levels.length + filters.topics.length + filters.partsOfSpeech.length + filters.states.length + filters.mastery.length;

  useEffect(() => {
    let active = true;
    const fetchFilters = async () => {
      try {
        const response = await getSearchFilters(token);
        if (!active) return;
        setOptions(response);
      } catch {
        if (!active) return;
        setOptions({
          levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
          topics: topics.map((topic) => topic.name),
          partsOfSpeech: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection'],
          states: ['Known', 'Learning', 'Forgotten', 'NotStarted'],
          mastery: ['Mastered', 'InProgress', 'Struggling', 'NotStarted'],
          sortOptions: [
            'alphabetical_asc',
            'alphabetical_desc',
            'level_asc',
            'level_desc',
            'learned_desc',
            'learned_asc',
            'frequency_desc',
            'frequency_asc',
            'accuracy_desc',
            'accuracy_asc'
          ]
        });
      }
    };

    void fetchFilters();
    return () => {
      active = false;
    };
  }, [token]);

  const fetchResults = useCallback(
    async (nextPage: number, reset: boolean) => {
      setLoading(true);
      setError(null);
      setOffline(false);
      try {
        const response = await searchWords(token, {
          query: query.trim() || undefined,
          levels: filters.levels,
          topics: filters.topics,
          partsOfSpeech: filters.partsOfSpeech,
          states: filters.states,
          mastery: filters.mastery,
          sort,
          page: nextPage,
          count: 20
        });

        setResults((prev) => (reset ? response.results : [...prev, ...response.results]));
        setPage(response.page);
        setHasMore(response.hasMore);
        await cacheSearchResults(response.results);
      } catch (err) {
        const cached = await getCachedSearchResults();
        const localFiltered = sortLocal(applyLocalFilters(cached, query, filters), sort);
        setResults(localFiltered);
        setPage(1);
        setHasMore(false);
        setOffline(true);
        setError(err instanceof Error ? err.message : 'Failed to search');
      } finally {
        setLoading(false);
      }
    },
    [token, query, filters, sort]
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      void fetchResults(1, true);
    }, 250);
    return () => clearTimeout(debounce);
  }, [query, filters, sort, fetchResults]);

  const handleLoadMore = () => {
    if (loading || !hasMore || offline) return;
    void fetchResults(page + 1, false);
  };

  const toLearningWord = (word: SearchWord): LearningWord => ({
    id: word.id,
    text: word.text,
    meaning: word.meaning,
    phonetic: word.phonetic,
    audio: word.audio,
    example: word.example,
    topic: word.topic,
    partOfSpeech: word.partOfSpeech,
    level: word.level,
    state: word.state
  });

  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.background, COLORS.surface]} style={styles.hero}>
          <View style={styles.headerRow}>
            <BackButton onPress={onBack} />
            <Pressable style={styles.filterButton} onPress={() => setShowFilters(true)}>
              <Text style={styles.filterText}>Filters</Text>
              <FilterBadge count={activeFilterCount} />
            </Pressable>
          </View>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find words, meanings, and examples.</Text>
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
      </LinearGradient>

      {options && (
        <View style={styles.sortSection}>
          <Text style={styles.sortLabel}>Sort</Text>
          <SortPicker value={sort} options={options.sortOptions} onChange={setSort} />
        </View>
      )}

      {loading && results.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<Text style={styles.emptyText}>{offline ? 'No cached results available.' : 'No results found.'}</Text>}
          renderItem={({ item }) => (
            <SearchResultCard
              word={item}
              query={query}
              isFavorite={favoriteWords.some((favorite) => favorite.id === item.id)}
              onToggleFavorite={(word) => onToggleFavorite(toLearningWord(word))}
              onLearn={async (word) => {
                try {
                  await updateWordState(token, word.id, 'Known');
                  setResults((prev) =>
                    prev.map((entry) =>
                      entry.id === word.id
                        ? { ...entry, state: 'Known', mastery: entry.mastery === 'NotStarted' ? 'InProgress' : entry.mastery }
                        : entry
                    )
                  );
                } catch (err) {
                  Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update word');
                }
              }}
            />
          )}
          ListFooterComponent={loading && results.length > 0 ? <ActivityIndicator size="small" color={COLORS.primary} /> : null}
        />
      )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <FilterModal
          visible={showFilters}
          options={options}
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          onApply={() => setShowFilters(false)}
          onClose={() => setShowFilters(false)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  hero: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18, gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.textMuted },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterText: { color: COLORS.primary, fontWeight: '600' },
  sortSection: { gap: 8, paddingHorizontal: 20, paddingVertical: 10 },
  sortLabel: { color: COLORS.textMuted, fontWeight: '600' },
  list: { gap: 12, paddingHorizontal: 20, paddingBottom: 24 },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginTop: 20 },
  errorText: { color: COLORS.error, fontSize: 12, textAlign: 'center', paddingBottom: 8 },
  loadingWrap: { paddingTop: 40 }
});
