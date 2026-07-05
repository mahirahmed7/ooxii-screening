/**
 * Field-clinic design language: sunlight-readable contrast, oversized touch
 * targets, near-zero chrome. Palette drawn from ophthalmic kit — optotype
 * black on chart white, with a single "iris teal" action colour.
 */
export const colors = {
  bg: '#FAFAF7', // chart white
  ink: '#101314', // optotype black
  teal: '#0E7C7B', // primary action
  tealDark: '#0A5958',
  amber: '#B4690E', // paddle / caution
  red: '#A82E2E', // bad / refer
  green: '#2E7D46', // good / pass
  line: '#D9D9D2',
  muted: '#5C6366',
};

export const type = {
  display: { fontSize: 28, fontWeight: '800' as const, color: colors.ink, letterSpacing: -0.5 },
  h2: { fontSize: 19, fontWeight: '700' as const, color: colors.ink },
  body: { fontSize: 16, color: colors.ink, lineHeight: 23 },
  label: { fontSize: 12, fontWeight: '700' as const, color: colors.muted, textTransform: 'uppercase' as const, letterSpacing: 1.2 },
};
