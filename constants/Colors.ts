const Colors = {
  // ─── Backgrounds ───────────────────────────────────────────────────────────
  background: '#0F0D0E',
  surface: '#1A1616',
  surfaceElevated: '#231D1E',
  surfaceHighlight: '#2C2425',

  // ─── Brand ─────────────────────────────────────────────────────────────────
  primary: '#D4B996',       // Champagne gold — brand wordmark, highlights
  primaryDark: '#B8985F',
  accent: '#8B2942',        // Deep wine/burgundy — primary actions
  accentMuted: 'rgba(139, 41, 66, 0.16)',
  accentLight: '#A8425B',

  // ─── Text ──────────────────────────────────────────────────────────────────
  textPrimary: '#F5F1EC',
  textSecondary: '#A69C95',
  textMuted: '#6B615C',
  textInverse: '#0F0D0E',

  // ─── Borders ───────────────────────────────────────────────────────────────
  border: '#2E2726',
  borderSubtle: '#201A1B',

  // ─── Status ────────────────────────────────────────────────────────────────
  error: '#E85C5C',
  errorMuted: 'rgba(232, 92, 92, 0.15)',
  success: '#4FAE7A',
  successMuted: 'rgba(79, 174, 122, 0.15)',
  warning: '#E0A83E',
  warningMuted: 'rgba(224, 168, 62, 0.15)',
  info: '#5C8FE8',
  infoMuted: 'rgba(92, 143, 232, 0.15)',

  // ─── Overlays ──────────────────────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayHeavy: 'rgba(0, 0, 0, 0.85)',
  shimmer: '#1E1817',

  // ─── Gradient stops (use with expo-linear-gradient) ────────────────────────
  gradientCard: ['transparent', 'rgba(0,0,0,0.85)'] as const,
  gradientHero: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.92)'] as const,
};

export default Colors;
