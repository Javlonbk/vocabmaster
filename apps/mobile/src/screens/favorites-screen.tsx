import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { LearningWord } from '../types/learning';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type FavoritesScreenProps = {
  favorites: LearningWord[];
  onRemove: (wordId: string) => void;
  onBack: () => void;
};

export function FavoritesScreen({ favorites, onRemove, onBack }: FavoritesScreenProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return favorites;
    return favorites.filter((word) => word.text.toLowerCase().includes(normalized));
  }, [favorites, query]);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.title}>Favorites</Text>
        </View>

      <TextInput
        placeholder="Search favorites"
        placeholderTextColor={COLORS.textMuted}
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No favorites yet.</Text>
        ) : (
          filtered.map((word) => (
            <View key={word.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.word}>{word.text}</Text>
                <Pressable onPress={() => onRemove(word.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
              <Text style={styles.meaning}>{word.meaning}</Text>
              <Text style={styles.meta}>{word.level} - {word.topic}</Text>
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  search: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.input, padding: 12, color: COLORS.text, backgroundColor: COLORS.surfaceSoft },
  emptyText: { color: COLORS.textMuted },
  card: { backgroundColor: COLORS.surface, borderRadius: RADII.card, padding: 14, gap: 6, ...SHADOWS.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  word: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  meaning: { color: COLORS.textMuted },
  meta: { color: COLORS.textMuted, fontSize: 12 },
  removeText: { color: COLORS.error, fontWeight: '600' }
});
