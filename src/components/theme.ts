/**
 * Field-clinic design language: sunlight-readable contrast, oversized touch
 * targets, near-zero chrome. The app chrome (menus, buttons, results) uses a
 * purple family with blue and yellow/gold complements. The screening itself
 * stays strictly optotype-black on chart-white — no colour on the test screen.
 */
export const colors = {
  bg: '#FAFAF7', // chart white — optotype background, never tinted
  ink: '#141019', // optotype black (a hair of purple, still ~black)

  primary: '#6D28D9', // purple — primary action
  primaryDark: '#5B21B6',
  blue: '#2563EB', // complementary accent (calibration)
  yellow: '#F2C744', // complementary accent (fills / highlights)
  amber: '#A16207', // caution / paddle — gold, legible as text on white

  red: '#A82E2E', // bad / refer
  green: '#2E7D46', // good / pass

  line: '#DBD7E6', // divider (soft purple-grey)
  muted: '#5C5866', // muted text (purple-grey)
};

export const type = {
  display: { fontSize: 28, fontWeight: '800' as const, color: colors.ink, letterSpacing: -0.5 },
  h2: { fontSize: 19, fontWeight: '700' as const, color: colors.ink },
  body: { fontSize: 16, color: colors.ink, lineHeight: 23 },
  label: { fontSize: 12, fontWeight: '700' as const, color: colors.muted, textTransform: 'uppercase' as const, letterSpacing: 1.2 },
};
