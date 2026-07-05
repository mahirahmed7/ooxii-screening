import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { loadSettings, Settings } from '@/store/calibration';
import { getScreening, updateScreening } from '@/db/database';
import { StaircaseRunner } from '@/components/TestRunner';
import { Button } from '@/components/ui';
import { colors, type } from '@/components/theme';
import { decide, nearIsGood } from '@/engine/decision';

/**
 * Near vision test, both eyes together at the calibrated near distance
 * (default 40 cm). Full descending staircase so we capture the actual
 * logMAR value needed by the paddle workflow. GOOD = 0.2 or better.
 */
export default function NearTest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [phase, setPhase] = useState<'brief' | 'test'>('brief');

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  if (!settings || settings.pxPerMm === null) return null;

  const onDone = (logmar: number | null) => {
    const good = nearIsGood(logmar);
    const row = getScreening(Number(id))!;
    const outcome = decide(
      row.distance_right === 'good',
      row.distance_left === 'good',
      good
    );
    updateScreening(Number(id), {
      near_result: good ? 'good' : 'bad',
      near_logmar: logmar,
      near_worse_than_max: logmar === null ? 1 : 0,
      outcome,
    });
    if (outcome === 'PADDLE') router.replace(`/screening/${id}/paddle`);
    else router.replace(`/screening/${id}/results`);
  };

  if (phase === 'brief') {
    return (
      <View style={styles.brief}>
        <Text style={type.display}>Near vision</Text>
        <Text style={type.body}>
          Patient holds the phone (or it is held) at{' '}
          {settings.nearTestMm / 10} cm — both eyes open, usual glasses OFF.
          The patient swipes the direction the E points. Letters get smaller
          as they answer correctly.
        </Text>
        <Button title="Begin" onPress={() => setPhase('test')} />
      </View>
    );
  }

  return (
    <StaircaseRunner
      headline="Near · both eyes · no glasses"
      distanceMm={settings.nearTestMm}
      pxPerMm={settings.pxPerMm}
      onDone={onDone}
    />
  );
}

const styles = StyleSheet.create({
  brief: { flex: 1, padding: 24, gap: 18, backgroundColor: colors.bg, justifyContent: 'center' },
});
