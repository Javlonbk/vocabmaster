import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, RADII, SHADOWS } from '../styles/theme';

type SearchBarProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export function SearchBar({ value, placeholder = 'Search words, meanings, examples', onChange, onClear }: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...SHADOWS.card
  },
  input: {
    flex: 1,
    color: COLORS.text
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADII.pill
  },
  clearText: {
    color: COLORS.primaryDark,
    fontWeight: '600',
    fontSize: 12
  }
});
