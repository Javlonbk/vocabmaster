import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { COLORS, RADII, SHADOWS } from '../styles/theme';
type FlashcardProps = {
  isFlipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
};

export function Flashcard({ isFlipped, onFlip, front, back }: FlashcardProps) {
  const rotate = useRef(new Animated.Value(isFlipped ? 180 : 0)).current;

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: isFlipped ? 180 : 0,
      duration: 250,
      useNativeDriver: true
    }).start();
  }, [isFlipped, rotate]);

  const frontRotate = useMemo(
    () =>
      rotate.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg']
      }),
    [rotate]
  );

  const backRotate = useMemo(
    () =>
      rotate.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg']
      }),
    [rotate]
  );

  return (
    <Pressable onPress={onFlip} style={styles.wrapper}>
      <View style={styles.card}>
        <Animated.View style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}>
          {front}
        </Animated.View>
        <Animated.View style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}>
          {back}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  card: {
    height: 340,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.cardLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
    padding: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center'
  }
});
