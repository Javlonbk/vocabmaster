import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CefrLevel } from '../types/shared';
import { COLORS, RADII } from '../styles/theme';

type ReadingControlsProps = {
  title: string;
  level: CefrLevel;
  topic: string;
  estimatedMinutes: number;
  progressPercent: number;
  bookmarked: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onPlayAudio: () => void;
  onOpenVocabulary: () => void;
};

export function ReadingControls({
  title,
  level,
  topic,
  estimatedMinutes,
  progressPercent,
  bookmarked,
  onBack,
  onToggleBookmark,
  onPlayAudio,
  onOpenVocabulary
}: ReadingControlsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.textButton}>
          <Text style={styles.textButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={onToggleBookmark} style={[styles.bookmarkPill, bookmarked && styles.bookmarkPillActive]}>
          <Text style={[styles.bookmarkText, bookmarked && styles.bookmarkTextActive]}>{bookmarked ? 'Bookmarked' : 'Bookmark'}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{level} - {topic} - {estimatedMinutes} min</Text>

      <View style={styles.actionsRow}>
        <Pressable onPress={onPlayAudio} style={styles.actionButton}>
          <Text style={styles.actionText}>Listen</Text>
        </Pressable>
        <Pressable onPress={onOpenVocabulary} style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.secondaryText}>Vocabulary</Text>
        </Pressable>
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progressPercent)}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercent)}% read</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textButton: { paddingVertical: 4, paddingHorizontal: 4 },
  textButtonText: { color: COLORS.primaryDark, fontWeight: '600' },
  bookmarkPill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: RADII.pill, backgroundColor: COLORS.border },
  bookmarkPillActive: { backgroundColor: COLORS.orangeSoft },
  bookmarkText: { color: COLORS.textMuted, fontWeight: '600', fontSize: 12 },
  bookmarkTextActive: { color: COLORS.orange },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  meta: { color: COLORS.textMuted },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionButton: { backgroundColor: COLORS.ink, paddingVertical: 8, paddingHorizontal: 12, borderRadius: RADII.input },
  secondaryButton: { backgroundColor: COLORS.primarySoft },
  actionText: { color: '#fff', fontWeight: '600' },
  secondaryText: { color: COLORS.primaryDark, fontWeight: '600' },
  progressWrap: { flex: 1, gap: 4 },
  progressTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: RADII.pill, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: COLORS.primary },
  progressText: { fontSize: 12, color: COLORS.textMuted }
});
