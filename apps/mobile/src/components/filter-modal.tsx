import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import type { SearchFilters, SearchFiltersResponse } from '../types/search';
import type { CefrLevel, WordState } from '../types/shared';
import type { MasteryLabel } from '../types/search';
import { COLORS, RADII } from '../styles/theme';

type FilterModalProps = {
  visible: boolean;
  options: SearchFiltersResponse | null;
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
};

function toggleValue<T>(list: T[], value: T): T[] {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }
  return [...list, value];
}

export function FilterModal({ visible, options, filters, onChange, onApply, onClear, onClose }: FilterModalProps) {
  if (!visible) return null;

  const updateLevels = (level: CefrLevel) => onChange({ ...filters, levels: toggleValue(filters.levels, level) });
  const updateTopics = (topic: string) => onChange({ ...filters, topics: toggleValue(filters.topics, topic) });
  const updateParts = (part: string) => onChange({ ...filters, partsOfSpeech: toggleValue(filters.partsOfSpeech, part) });
  const updateStates = (state: WordState | 'NotStarted') => onChange({ ...filters, states: toggleValue(filters.states, state) });
  const updateMastery = (label: MasteryLabel) => onChange({ ...filters, mastery: toggleValue(filters.mastery, label) });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Section title="Level">
              {options?.levels.map((level) => (
                <Chip key={level} label={level} active={filters.levels.includes(level)} onPress={() => updateLevels(level)} />
              ))}
            </Section>
            <Section title="Topic">
              {options?.topics.map((topic) => (
                <Chip key={topic} label={topic} active={filters.topics.includes(topic)} onPress={() => updateTopics(topic)} />
              ))}
            </Section>
            <Section title="Part of Speech">
              {options?.partsOfSpeech.map((part) => (
                <Chip key={part} label={part} active={filters.partsOfSpeech.includes(part)} onPress={() => updateParts(part)} />
              ))}
            </Section>
            <Section title="Word State">
              {options?.states.map((state) => (
                <Chip key={state} label={state} active={filters.states.includes(state)} onPress={() => updateStates(state)} />
              ))}
            </Section>
            <Section title="Mastery">
              {options?.mastery.map((label) => (
                <Chip key={label} label={label} active={filters.mastery.includes(label)} onPress={() => updateMastery(label)} />
              ))}
            </Section>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={onClear} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear All</Text>
            </Pressable>
            <Pressable onPress={onApply} style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipRow}>{children}</View>
    </View>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.4)'
  },
  sheet: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopLeftRadius: RADII.cardLg,
    borderTopRightRadius: RADII.cardLg,
    maxHeight: '85%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  closeText: { color: COLORS.primary, fontWeight: '600' },
  content: { gap: 16, paddingVertical: 12 },
  section: { gap: 8 },
  sectionTitle: { color: COLORS.textMuted, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.border
  },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 },
  clearButton: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#fee2e2', borderRadius: RADII.input },
  clearText: { color: COLORS.error, fontWeight: '600' },
  applyButton: { backgroundColor: COLORS.primary, borderRadius: RADII.input, paddingVertical: 10, paddingHorizontal: 16 },
  applyText: { color: '#fff', fontWeight: '600' }
});
