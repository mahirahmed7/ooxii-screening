import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { listScreenings, Screening } from '@/db/database';
import { loadSettings } from '@/store/calibration';
import { EMPTY_PROFILE, loadProfile, Profile } from '@/store/profile';
import { exportAndShare } from '@/export/csv';
import { Avatar, Button } from '@/components/ui';
import { colors, type } from '@/components/theme';
import { formatLogmar } from '@/engine/logmar';

export default function Home() {
  const router = useRouter();
  const [rows, setRows] = useState<Screening[]>([]);
  const [calibrated, setCalibrated] = useState(true);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);

  useFocusEffect(
    useCallback(() => {
      setRows(listScreenings());
      loadSettings().then((s) => setCalibrated(s.pxPerMm !== null));
      loadProfile().then(setProfile);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/profile')}
              hitSlop={8}
              style={{ marginRight: 4 }}
            >
              <Avatar uri={profile.photoUri} name={profile.name} size={32} />
            </Pressable>
          ),
        }}
      />
      {!calibrated && (
        <View style={styles.warn}>
          <Text style={styles.warnText}>
            Screen not calibrated — optotype sizes will be wrong. Calibrate
            before testing.
          </Text>
        </View>
      )}

      <Button
        title="＋ New screening"
        onPress={() =>
          calibrated ? router.push('/screening/new') : router.push('/calibration')
        }
      />
      <View style={styles.row}>
        <Button
          title="Calibration"
          variant="ghost"
          style={{ flex: 1 }}
          onPress={() => router.push('/calibration')}
        />
        <Button
          title="Export CSV"
          variant="ghost"
          style={{ flex: 1 }}
          disabled={rows.length === 0}
          onPress={() => exportAndShare(rows)}
        />
      </View>

      <Text style={[type.label, { marginTop: 26, marginBottom: 8 }]}>
        {rows.length} screening{rows.length === 1 ? '' : 's'} on this device
      </Text>
      <FlatList
        data={rows}
        keyExtractor={(r) => String(r.id)}
        renderItem={({ item }) => <Row r={item} />}
        ListEmptyComponent={
          <Text style={{ color: colors.muted, marginTop: 12 }}>
            No screenings yet. Results are stored on this phone and exported
            as CSV — no internet needed in the field.
          </Text>
        }
      />
    </View>
  );
}

function Row({ r }: { r: Screening }) {
  const outcomeColor =
    r.outcome === 'PASS'
      ? colors.green
      : r.outcome === 'PADDLE'
        ? colors.amber
        : r.outcome === 'REFER_FULL_TEST'
          ? colors.red
          : colors.muted;
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={type.h2}>
          #{r.id} · b.{r.year_of_birth} · {r.gender}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 2 }}>
          D: R {r.distance_right ?? '—'} / L {r.distance_left ?? '—'} · N:{' '}
          {r.near_result ?? '—'}
          {r.near_result &&
            ` (${r.near_worse_than_max ? '> 1.0' : formatLogmar(r.near_logmar)})`}
          {r.paddle_power ? ` · +${r.paddle_power.toFixed(1)}` : ''}
        </Text>
      </View>
      <View style={[styles.dot, { backgroundColor: outcomeColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, backgroundColor: colors.bg },
  row: { flexDirection: 'row', gap: 12 },
  warn: {
    backgroundColor: '#FBEFDD',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.amber,
  },
  warnText: { color: colors.amber, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 10,
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
});
