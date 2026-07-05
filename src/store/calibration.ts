import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Device calibration + test distances.
 * pxPerMm comes from matching an on-screen bar to a real credit card
 * (ISO/IEC 7810 ID-1 width = 85.60 mm). Distances are in mm.
 */

export const CREDIT_CARD_MM = 85.6;

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
