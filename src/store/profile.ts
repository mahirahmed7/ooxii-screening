import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Screener profile — who is running the screenings on this device. Stored
 * locally (AsyncStorage); the name is stamped onto every exported CSV row so
 * the reporting pipeline knows who collected each record.
 */
export interface Profile {
  name: string;
  role: string; // e.g. "Volunteer", "Optometrist"
  organization: string;
  photoUri: string | null; // persisted file:// path to the profile photo
}

export const EMPTY_PROFILE: Profile = {
  name: '',
  role: '',
  organization: '',
  photoUri: null,
};

const KEY = 'ooxii.profile.v1';

export async function loadProfile(): Promise<Profile> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return { ...EMPTY_PROFILE };
  try {
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export async function saveProfile(p: Profile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}
