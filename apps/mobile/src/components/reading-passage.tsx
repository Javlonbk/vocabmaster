import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { parseVocabMarkup } from '@vocabmaster/shared';
import { COLORS } from '../styles/theme';

type ReadingPassageProps = {
  content: string;
  onSelectWord: (word: string, anchorX: number, anchorY: number) => void;
};

export function ReadingPassage({ content, onSelectWord }: ReadingPassageProps) {
  const segments = useMemo(() => parseVocabMarkup(content), [content]);

  return (
    <Text style={styles.text}>
      {segments.map((segment, index) => {
        if (!segment.isVocab) {
          return <Text key={`seg-${index}`}>{segment.text}</Text>;
        }

        return (
          <Text
            key={`seg-${index}`}
            style={styles.highlight}
            onPress={(event) => {
              const { pageX, pageY } = event.nativeEvent;
              onSelectWord(segment.text, pageX, pageY);
            }}
          >
            {segment.text}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text
  },
  highlight: {
    color: COLORS.primaryDark,
    fontWeight: '700',
    backgroundColor: COLORS.primarySoft
  }
});
