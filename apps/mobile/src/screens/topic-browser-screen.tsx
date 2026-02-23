import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { topics } from '../config/topics';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type TopicBrowserScreenProps = {
  onSelectTopic: (topic: string) => void;
  onBack: () => void;
};

export function TopicBrowserScreen({ onSelectTopic, onBack }: TopicBrowserScreenProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return topics;
    return topics.filter((topic) => topic.name.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.title}>Browse Topics</Text>
        </View>

      <TextInput
        placeholder="Search topics"
        placeholderTextColor={COLORS.textMuted}
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

        <View style={styles.grid}>
          {filtered.map((topic) => (
            <Pressable key={topic.name} style={styles.card} onPress={() => onSelectTopic(topic.name)}>
              <Text style={styles.cardTitle}>{topic.name}</Text>
              <Text style={styles.cardMeta}>{topic.wordCount} words</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  search: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.input, padding: 12, color: COLORS.text, backgroundColor: COLORS.surfaceSoft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flexBasis: '48%', backgroundColor: COLORS.surface, borderRadius: RADII.card, padding: 14, ...SHADOWS.card },
  cardTitle: { fontWeight: '600', color: COLORS.text },
  cardMeta: { color: COLORS.textMuted, marginTop: 6, fontSize: 12 }
});
