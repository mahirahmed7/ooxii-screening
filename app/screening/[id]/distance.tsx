import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { loadSettings, Settings } from '@/store/calibration';
import { updateScreening } from '@/db/database';
import { ThresholdRunner } from '@/components/TestRunner';
import { Button, InlineE } from '@/components/ui';
import { colors, type } from '@/components/theme';

type Eye = 'right' | 'left';

/**
 * Distance screening: each eye separately (other eye covered), patient at
 * the calibrated distance (default 3 m). GOOD = reads the 0.2 logMAR line
 * (>= 3 of 5 tumbling Es). The patient signals direction by hand; the
 * tester enters it.
 */
export default function DistanceTest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [eye, setEye] = useState<Eye>('right');
  const [phase, setPhase] = useState<'brief' | 'test'>('brief');
  const [rightGood, setRightGood] = useState<boolean | null>(null);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  if (!settings || settings.pxPerMm === null) return null;

  const onDone = (good: boolean) => {
    if (eye === 'right') {
      updateScreening(Number(id), { distance_right: good ? 'good' : 'bad' });
      setRightGood(good);
      setEye('left');
      setPhase('brief');
    } else {
      updateScreening(Number(id), { distance_left: good ? 'good' : 'bad' });
      router.replace(`/screening/${id}/near`);
    }
  };

  if (phase === 'brief') {
    return (
      <View style={styles.brief}>
        <Text style={type.display}>
          {eye === 'right' ? 'Right eye' : 'Left eye'}
        </Text>
        <Text style={type.body}>
          Patient stands {settings.distanceTestMm / 1000} m from the screen
          (use the measured rope). Cover the{' '}
          <Text style={{ fontWeight: '800' }}>
            {eye === 'right' ? 'LEFT' : 'RIGHT'}
          </Text>{' '}
          eye. The patient points the direction the <InlineE /> faces; you
          enter it below. First <InlineE /> is practice.
        </Text>
        {eye === 'left' && rightGood !== null && (
          <Text style={{ color: colors.muted }}>
            Right eye: {rightGood ? 'GOOD' : 'BAD'}
          </Text>
        )}
        <Button title="Begin" onPress={() => setPhase('test')} />
      </View>
    );
  }

  return (
    <ThresholdRunner
      key={eye}
      headline={`Distance · ${eye} eye · 0.2 logMAR line`}
      distanceMm={settings.distanceTestMm}
      pxPerMm={settings.pxPerMm}
      onDone={onDone}
    />
  );
}

const styles = StyleSheet.create({
  brief: { flex: 1, padding: 24, gap: 18, backgroundColor: colors.bg, justifyContent: 'center' },
});
