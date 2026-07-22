import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Device calibration + test distances.
 * pxPerMm comes from matching a vertical on-screen bar to the LONG edge of a
 * real credit card (ISO/IEC 7810 ID-1 = 85.60 mm). We use the long edge on a
 * vertical bar because no phone's screen is 85.60 mm wide in portrait, but
 * every screen is far taller than that — so the long edge always fits and
 * gives the best precision. Distances are in mm.
 */

export const CREDIT_CARD_MM = 85.6; // ID-1 long edge

export interface Settings {
  pxPerMm: number | null;
  distanceTestMm: number; // patient-to-screen for distance test
  nearTestMm: number; // patient-to-screen for near tests
}

export const DEFAULTS: Settings = {
  pxPerMm: null,
  distanceTestMm: 3000, // 3 m
  nearTestMm: 400, // 40 cm
};

const KEY = 'ooxii.settings.v1';

export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return { ...DEFAULTS };
  try {
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveSettings(s: Settings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(s));
}
