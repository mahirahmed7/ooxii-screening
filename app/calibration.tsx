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
 * has a long edge of exactly 85.60 mm. The tester stands the card on end
 * against a vertical on-screen bar and resizes the bar until it matches the
 * card's long edge; that gives true pixels-per-mm for this device, which
 * every optotype size is derived from. The bar is vertical because 85.60 mm
 * is wider than a phone screen in portrait but always shorter than it is tall.
 */
export default function Calibration() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [barPx, setBarPx] = useState(320);

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
        Stand any standard bank/ID card on end against the{' '}
        <Text style={{ fontWeight: '800' }}>left edge</Text> of the screen.
        Resize the bar until it matches the card's{' '}
        <Text style={{ fontWeight: '800' }}>long side</Text> exactly, top to
        bottom.
      </Text>

      <View style={styles.calRow}>
        <View style={[styles.bar, { height: barPx }]}>
          <Text style={styles.barText}>85.60 mm</Text>
        </View>
        <View style={styles.nudgeCol}>
          <Button title="+10" variant="ghost" onPress={() => nudge(10)} style={styles.nudge} />
          <Button title="+1" variant="ghost" onPress={() => nudge(1)} style={styles.nudge} />
          <Button title="−1" variant="ghost" onPress={() => nudge(-1)} style={styles.nudge} />
          <Button title="−10" variant="ghost" onPress={() => nudge(-10)} style={styles.nudge} />
        </View>
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
  calRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  bar: {
    width: 68,
    backgroundColor: colors.blue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
    transform: [{ rotate: '-90deg' }],
    width: 90,
    textAlign: 'center',
  },
  nudgeCol: { flex: 1, gap: 8 },
  nudge: { minHeight: 48 },
  input: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
    backgroundColor: '#fff',
  },
});
