import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  CREDIT_CARD_MM,
  loadSettings,
  saveSettings,
  Settings,
} from '@/store/calibration';
import { Button, Field } from '@/components/ui';
import { colors, type } from '@/components/theme';

/**
 * Credit-card calibration. Any ID-1 card (bank card, Opal, driver licence)
 * is exactly 85.60 mm wide. The tester adjusts the on-screen bar until the
 * card covers it edge-to-edge; that gives true pixels-per-mm for this device,
 * which every optotype size is derived from.
 */
export default function Calibration() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [barPx, setBarPx] = useState(300);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      if (s.pxPerMm) setBarPx(Math.round(s.pxPerMm * CREDIT_CARD_MM));
    });
  }, []);

  if (!settings) return null;

  const nudge = (d: number) => setBarPx((p) => Math.max(120, p + d));

  const save = async () => {
    const next: Settings = { ...settings, pxPerMm: barPx / CREDIT_CARD_MM };
    await saveSettings(next);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={type.body}>
        Hold any standard bank/ID card against the screen. Resize the bar
        until the card's <Text style={{ fontWeight: '800' }}>width</Text>{' '}
        matches it exactly.
      </Text>

      <View style={[styles.bar, { width: barPx }]}>
        <Text style={styles.barText}>85.60 mm</Text>
      </View>

      <View style={styles.nudgeRow}>
        <Button title="−10" variant="ghost" onPress={() => nudge(-10)} style={styles.nudge} />
        <Button title="−1" variant="ghost" onPress={() => nudge(-1)} style={styles.nudge} />
        <Button title="+1" variant="ghost" onPress={() => nudge(1)} style={styles.nudge} />
        <Button title="+10" variant="ghost" onPress={() => nudge(10)} style={styles.nudge} />
      </View>

      <Field label="Distance test — patient distance (metres)">
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          defaultValue={String(settings.distanceTestMm / 1000)}
          onChangeText={(t) => {
            const v = parseFloat(t);
            if (!isNaN(v) && v > 0)
              setSettings({ ...settings, distanceTestMm: v * 1000 });
          }}
        />
      </Field>
      <Field label="Near test — patient distance (centimetres)">
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          defaultValue={String(settings.nearTestMm / 10)}
          onChangeText={(t) => {
            const v = parseFloat(t);
            if (!isNaN(v) && v > 0)
              setSettings({ ...settings, nearTestMm: v * 10 });
          }}
        />
      </Field>
      <Text style={{ color: colors.muted, marginBottom: 18 }}>
        Use a pre-measured string/rope at these distances in the field so
        every test is at the same distance.
      </Text>

      <Button title="Save calibration" onPress={save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 18, backgroundColor: colors.bg },
  bar: {
    height: 110,
    backgroundColor: colors.teal,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  barText: { color: '#fff', fontWeight: '800' },
  nudgeRow: { flexDirection: 'row', gap: 8 },
  nudge: { flex: 1, minHeight: 48 },
  input: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
    backgroundColor: '#fff',
  },
});
