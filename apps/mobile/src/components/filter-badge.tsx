import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/theme';

type FilterBadgeProps = {
  count: number;
};

export function FilterBadge({ count }: FilterBadgeProps) {
  if (count <= 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
});
