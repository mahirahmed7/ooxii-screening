import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import {
  EMPTY_PROFILE,
  loadProfile,
  Profile,
  saveProfile,
} from '@/store/profile';
import { Avatar, Button, Field } from '@/components/ui';
import { colors } from '@/components/theme';

/**
 * Screener profile: who is running screenings on this device. The name is
 * stamped onto every exported CSV row. Photo + details are stored locally.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);

  useEffect(() => {
    loadProfile().then(setProfile);
  }, []);

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permission needed',
        'Allow photo access to set a profile picture.'
      );
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (res.canceled) return;
    // Copy into the app's document dir with a fresh name so it persists and
    // isn't cached to a stale frame.
    const dest = `${FileSystem.documentDirectory}profile-${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: res.assets[0].uri, to: dest });
    setProfile((p) => ({ ...p, photoUri: dest }));
  };

  const save = async () => {
    await saveProfile({ ...profile, name: profile.name.trim() });
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarRow}>
        <Pressable onPress={pickPhoto}>
          <Avatar uri={profile.photoUri} name={profile.name} size={96} />
        </Pressable>
        <Pressable onPress={pickPhoto}>
          <Text style={styles.change}>
            {profile.photoUri ? 'Change photo' : 'Add photo'}
          </Text>
        </Pressable>
        {!!profile.staffId && (
          <Text style={styles.staffId}>ID: {profile.staffId}</Text>
        )}
      </View>

      <Field label="Name">
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(name) => setProfile((p) => ({ ...p, name }))}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
        />
      </Field>

      <Field label="Role">
        <TextInput
          style={styles.input}
          value={profile.role}
          onChangeText={(role) => setProfile((p) => ({ ...p, role }))}
          placeholder="e.g. Volunteer, Optometrist"
          placeholderTextColor={colors.muted}
        />
      </Field>

      <Field label="Organization">
        <TextInput
          style={styles.input}
          value={profile.organization}
          onChangeText={(organization) =>
            setProfile((p) => ({ ...p, organization }))
          }
          placeholder="e.g. OOXii"
          placeholderTextColor={colors.muted}
        />
      </Field>

      <Text style={{ color: colors.muted, marginBottom: 18 }}>
        Your name is added to every exported CSV so the reporting team knows
        who collected each screening.
      </Text>

      <Button title="Save profile" onPress={save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.bg },
  avatarRow: { alignItems: 'center', gap: 10, marginBottom: 24 },
  change: { color: colors.primary, fontWeight: '700' },
  staffId: { color: colors.muted, fontWeight: '700', letterSpacing: 1 },
  input: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
    backgroundColor: '#fff',
  },
});
