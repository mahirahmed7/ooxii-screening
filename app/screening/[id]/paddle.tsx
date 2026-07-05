import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { loadSettings, Settings } from '@/store/calibration';
import { updateScreening } from '@/db/database';
import { StaircaseRunner } from '@/components/TestRunner';
import { Button, Chip } from '@/components/ui';
import { colors, type } from '@/components/theme';
import { PADDLE_POWERS } from '@/engine/decision';

/**
 * Paddle test: distance vision is good but near is bad. The client tries
 * the paddle and picks their preferred power, readers are dispensed, and
 * the near test is repeated WITH the new glasses to verify improvement.
 */
export default function PaddleTest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [power, setPower] = useState<number | null>(null);
  const [phase, setPhase] = useState<'select' | 'test'>('select');

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  if (!settings || settings.pxPerMm === null) return null;

  const confirmPower = () => {
    updateScreening(Number(id), { paddle_power: power });
    setPhase('test');
  };

  const onDone = (logmar: number | null) => {
    updateScreening(Number(id), {
      near_logmar_with_glasses: logmar,
      near_with_glasses_worse_than_max: logmar === null ? 1 : 0,
    });
    router.replace(`/screening/${id}/results`);
  };

  if (phase === 'select') {
    return (
      <View style={styles.brief}>
        <Text style={type.display}>Paddle test</Text>
        <Text style={type.body}>
          Distance vision is good, near vision needs help. Let the client try
          the paddle and choose the power that works best, then dispense the
          reading glasses.
        </Text>
        <View style={styles.chips}>
          {PADDLE_POWERS.map((p) => (
            <Chip
              key={p}
              label={`+${p.toFixed(1)}`}
              selected={power === p}
              onPress={() => setPower(p)}
            />
          ))}
        </View>
        <Button
          title="Glasses on — retest near vision"
          onPress={confirmPower}
          disabled={power === null}
        />
      </View>
    );
  }

  return (
    <StaircaseRunner
      headline={`Near · both eyes · with +${power?.toFixed(1)} readers`}
      distanceMm={settings.nearTestMm}
      pxPerMm={settings.pxPerMm}
      onDone={onDone}
    />
  );
}

const styles = StyleSheet.create({
  brief: { flex: 1, padding: 24, gap: 18, backgroundColor: colors.bg, justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
