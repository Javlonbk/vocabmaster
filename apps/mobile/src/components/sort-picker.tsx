import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SearchSort } from '../types/search';
import { COLORS, RADII } from '../styles/theme';

const SORT_LABELS: Record<SearchSort, string> = {
  alphabetical_asc: 'A-Z',
  alphabetical_desc: 'Z-A',
  level_asc: 'Level Low-High',
  level_desc: 'Level High-Low',
  learned_desc: 'Newest Learned',
  learned_asc: 'Oldest Learned',
  frequency_desc: 'Most Common',
  frequency_asc: 'Least Common',
  accuracy_desc: 'Best Accuracy',
  accuracy_asc: 'Lowest Accuracy'
};

type SortPickerProps = {
  value: SearchSort;
  options: SearchSort[];
  onChange: (value: SearchSort) => void;
};

export function SortPicker({ value, options, onChange }: SortPickerProps) {
  return (
    <View style={styles.wrapper}>
      {options.map((option) => (
        <Pressable
          key={option}
          style={[styles.option, value === option && styles.optionActive]}
          onPress={() => onChange(option)}
        >
          <Text style={[styles.optionText, value === option && styles.optionTextActive]}>{SORT_LABELS[option]}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.border
  },
  optionActive: {
    backgroundColor: COLORS.primary
  },
  optionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  optionTextActive: {
    color: '#fff'
  }
});
