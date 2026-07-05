/**
 * logMAR optotype sizing.
 *
 * An optotype at logMAR L subtends 5 * MAR arcminutes, where MAR = 10^L.
 * Its physical height therefore depends only on the testing distance.
 * Conversion to pixels requires the device's true pixels-per-mm, which we
 * obtain from the one-time credit-card calibration (see store/calibration).
 */

export const SCREEN_PASS_LEVEL = 0.2; // Sarah's good/bad threshold (logMAR)

/** Physical letter height in mm for a given logMAR level and viewing distance. */
export function letterHeightMm(logmar: number, distanceMm: number): number {
  const marArcmin = Math.pow(10, logmar);
  const totalArcmin = 5 * marArcmin; // optotype = 5x5 grid, height = 5 MAR
  const angleRad = (totalArcmin / 60) * (Math.PI / 180);
  return 2 * distanceMm * Math.tan(angleRad / 2);
}

/** Letter height in on-screen pixels. */
export function letterHeightPx(
  logmar: number,
  distanceMm: number,
  pxPerMm: number
): number {
  return letterHeightMm(logmar, distanceMm) * pxPerMm;
}

export function formatLogmar(v: number | null): string {
  if (v === null) return '> 1.0';
  return v.toFixed(1);
}
