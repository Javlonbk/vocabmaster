import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '../../styles/theme';

type ScreenProps = {
  children: ReactNode;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export function Screen({ children, padded = true, style, contentStyle }: ScreenProps) {
  return (
    <LinearGradient colors={[COLORS.background, COLORS.surface]} style={[styles.screen, style]}>
      <View style={[padded && styles.padded, contentStyle]}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  padded: { padding: 20 }
});
