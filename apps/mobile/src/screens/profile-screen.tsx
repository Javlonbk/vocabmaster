import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { CefrLevel } from '../types/shared';
import { getSettings, type AppSettings } from '../utils/settings-storage';
import { COLORS, RADII, SHADOWS } from '../styles/theme';
import { Screen } from '../components/ui/screen';
import { BackButton } from '../components/ui/back-button';

type ProfileScreenProps = {
  email: string;
  level: CefrLevel | null;
  onUpdateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  onResetProgress: () => Promise<void>;
  onBack: () => void;
};

export function ProfileScreen({ email, level, onUpdateSettings, onResetProgress, onBack }: ProfileScreenProps) {
  const [settings, setSettings] = useState<AppSettings>({ audioEnabled: true, dailyGoal: 10, notifications: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const stored = await getSettings();
      setSettings(stored);
    })();
  }, []);

  const updateSetting = async (partial: Partial<AppSettings>) => {
    setSaving(true);
    await onUpdateSettings(partial);
    setSettings((prev) => ({ ...prev, ...partial }));
    setSaving(false);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.card}>
        <Text style={styles.sectionTitle}>User Info</Text>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{email || 'Not set'}</Text>
        <Text style={styles.infoLabel}>Level</Text>
        <Text style={styles.infoValue}>{level ?? 'Not selected'}</Text>
        </View>

        <View style={styles.card}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Audio</Text>
          <Pressable style={styles.toggleButton} onPress={() => updateSetting({ audioEnabled: !settings.audioEnabled })}>
            <Text style={styles.toggleText}>{settings.audioEnabled ? 'On' : 'Off'}</Text>
          </Pressable>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Pressable style={styles.toggleButton} onPress={() => updateSetting({ notifications: !settings.notifications })}>
            <Text style={styles.toggleText}>{settings.notifications ? 'On' : 'Off'}</Text>
          </Pressable>
        </View>
        <View style={styles.settingRow}
        >
          <Text style={styles.settingLabel}>Daily Goal</Text>
          <TextInput
            value={String(settings.dailyGoal)}
            onChangeText={(text) => {
              const next = Math.max(5, Math.min(50, Number(text) || 0));
              setSettings((prev) => ({ ...prev, dailyGoal: next }));
            }}
            onBlur={() => updateSetting({ dailyGoal: settings.dailyGoal })}
            keyboardType="number-pad"
            style={styles.goalInput}
          />
        </View>
        {saving ? <Text style={styles.savingText}>Saving...</Text> : null}
      </View>

        <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <Pressable
          style={styles.resetButton}
          onPress={() => {
            Alert.alert('Reset progress?', 'This will clear your stats, favorites, and settings.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  void onResetProgress();
                }
              }
            ]);
          }}
        >
          <Text style={styles.resetText}>Reset Progress</Text>
        </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  card: { backgroundColor: COLORS.surface, borderRadius: RADII.cardLg, padding: 16, gap: 10, ...SHADOWS.card },
  sectionTitle: { fontWeight: '600', color: COLORS.text },
  infoLabel: { color: COLORS.textMuted, fontSize: 12 },
  infoValue: { color: COLORS.text, fontWeight: '600' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { color: COLORS.textMuted },
  toggleButton: { backgroundColor: COLORS.primarySoft, paddingVertical: 6, paddingHorizontal: 14, borderRadius: RADII.input },
  toggleText: { color: COLORS.primaryDark, fontWeight: '600' },
  goalInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.input, paddingHorizontal: 10, paddingVertical: 6, minWidth: 70, textAlign: 'center', color: COLORS.text },
  savingText: { color: COLORS.textMuted, fontSize: 12 },
  resetButton: { borderRadius: RADII.input, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  resetText: { color: COLORS.error, fontWeight: '600' }
});
