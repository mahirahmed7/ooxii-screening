import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getScreening, Screening } from '@/db/database';
import { Button } from '@/components/ui';
import { colors, type } from '@/components/theme';
import { OUTCOME_LABELS, Outcome } from '@/engine/decision';
import { formatLogmar } from '@/engine/logmar';

export default function Results() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [row, setRow] = useState<Screening | null>(null);

  useEffect(() => {
    setRow(getScreening(Number(id)));
  }, [id]);

  if (!row) return null;

  const outcome = (row.outcome ?? 'REFER_FULL_TEST') as Outcome;
  const color =
    outcome === 'PASS'
      ? colors.green
      : outcome === 'PADDLE'
        ? colors.amber
        : colors.red;

  const nearVal = row.near_worse_than_max
    ? '> 1.0'
    : formatLogmar(row.near_logmar);
  const nearGlassesVal =
    row.near_logmar_with_glasses === null && !row.near_with_glasses_worse_than_max
      ? null
      : row.near_with_glasses_worse_than_max
        ? '> 1.0'
        : formatLogmar(row.near_logmar_with_glasses);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.banner, { backgroundColor: color }]}>
        <Text style={styles.bannerText}>{OUTCOME_LABELS[outcome]}</Text>
      </View>

      <Line label="Distance — right eye" value={row.distance_right ?? '—'} />
      <Line label="Distance — left eye" value={row.distance_left ?? '—'} />
      <Line
        label="Near vision (no glasses)"
        value={`${row.near_result ?? '—'}${row.near_result ? ` · ${nearVal} logMAR` : ''}`}
      />
      {row.paddle_power !== null && (
        <Line label="Paddle power dispensed" value={`+${row.paddle_power.toFixed(1)}`} />
      )}
      {nearGlassesVal !== null && (
        <Line label="Near vision with new glasses" value={`${nearGlassesVal} logMAR`} />
      )}

      <Button
        title="Done — next patient"
        onPress={() => router.dismissTo('/')}
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={type.label}>{label}</Text>
      <Text style={[type.h2, { marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.bg },
  banner: { borderRadius: 16, padding: 20, marginBottom: 20 },
  bannerText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  line: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
});
