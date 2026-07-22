import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Screener profile — who is running the screenings on this device. Stored
 * locally (AsyncStorage); the name is stamped onto every exported CSV row so
 * the reporting pipeline knows who collected each record.
 */
export interface Profile {
  staffId: string; // auto-generated, stable volunteer/staff ID for this device
  name: string;
  role: string; // e.g. "Volunteer", "Optometrist"
  organization: string;
  photoUri: string | null; // persisted file:// path to the profile photo
}

export const EMPTY_PROFILE: Profile = {
  staffId: '',
  name: '',
  role: '',
  organization: '',
  photoUri: null,
};

const KEY = 'ooxii.profile.v1';

/** Random human-readable ID, e.g. "VOL-7Q3K9F". Not security-sensitive. */
export function generateStaffId(): string {
  let s = '';
  for (let i = 0; i < 6; i++) {
    s += Math.floor(Math.random() * 36)
      .toString(36)
      .toUpperCase();
  }
  return `VOL-${s}`;
}

export async function loadProfile(): Promise<Profile> {
  const raw = await AsyncStorage.getItem(KEY);
  let profile: Profile = { ...EMPTY_PROFILE };
  if (raw) {
    try {
      profile = { ...EMPTY_PROFILE, ...JSON.parse(raw) };
    } catch {
      profile = { ...EMPTY_PROFILE };
    }
  }
  // Assign a stable staff ID on first load and persist it, so every device
  // that runs screenings has one — even before a name is entered.
  if (!profile.staffId) {
    profile.staffId = generateStaffId();
    await saveProfile(profile);
  }
  return profile;
}

export async function saveProfile(p: Profile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}
