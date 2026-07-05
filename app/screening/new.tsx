import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { createScreening } from '@/db/database';
import { Button, Chip, Field } from '@/components/ui';
import { colors } from '@/components/theme';

const GENDERS = ['female', 'male', 'other'];
const CATARACT = ['neither', 'right', 'left', 'both'];

export default function NewScreening() {
  const router = useRouter();
  const [yob, setYob] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [cataract, setCataract] = useState<string | null>(null);

  const year = parseInt(yob, 10);
  const yearOk =
    !isNaN(year) && year >= 1900 && year <= new Date().getFullYear();
  const ready = yearOk && gender !== null && cataract !== null;

  const start = () => {
    const id = createScreening(year, gender!, cataract!);
    router.replace(`/screening/${id}/distance`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Field label="Year of birth">
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={4}
          value={yob}
          onChangeText={setYob}
          placeholder="e.g. 1962"
          placeholderTextColor={colors.muted}
        />
      </Field>

      <Field label="Gender">
        <View style={styles.chips}>
          {GENDERS.map((g) => (
            <Chip key={g} label={g} selected={gender === g} onPress={() => setGender(g)} />
          ))}
        </View>
      </Field>

      <Field label="Cataract surgery">
        <View style={styles.chips}>
          {CATARACT.map((c) => (
            <Chip key={c} label={c} selected={cataract === c} onPress={() => setCataract(c)} />
          ))}
        </View>
      </Field>

      <Button title="Start distance test" onPress={start} disabled={!ready} />
      {!ready && (
        <Text style={{ color: colors.muted, marginTop: 10 }}>
          Fill in all three fields to start.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.bg },
  input: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
    backgroundColor: '#fff',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
