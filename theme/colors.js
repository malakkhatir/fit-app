export const lightColors = {
  // Primaire
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',

  // Fond sombre
  navy: '#0F172A',
  navyCard: '#1E293B',
  navyLight: '#334155',

  // Fonds
  background: '#F8FAFC',
  backgroundAlt: '#F1F5F9',
  card: '#FFFFFF',
  white: '#FFFFFF',

  // Textes
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnDark: '#FFFFFF',

  // Statuts
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',

  // Accents
  orange: '#F97316',
  orangeLight: '#FFEDD5',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  green: '#10B981',
  greenLight: '#D1FAE5',

  // Neutres
  border: '#E2E8F0',
  borderDark: '#CBD5E1',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors = {
  // Primaire (inchangé)
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#1E3A5F',

  // Fond sombre (nafs l'couleurs)
  navy: '#0A0E1A',
  navyCard: '#111827',
  navyLight: '#1F2937',

  // Fonds (mode sombre)
  background: '#0A0E1A',
  backgroundAlt: '#111827',
  card: '#1A2332',
  white: '#1A2332',

  // Textes (clairs f mode sombre)
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textOnDark: '#FFFFFF',

  // Statuts (foncés)
  success: '#4ADE80',
  successLight: '#14532D',
  warning: '#FBBF24',
  warningLight: '#78350F',
  danger: '#F87171',
  dangerLight: '#7F1D1D',

  // Accents
  orange: '#FB923C',
  orangeLight: '#7C2D12',
  purple: '#A78BFA',
  purpleLight: '#4C1D95',
  green: '#34D399',
  greenLight: '#064E3B',

  // Neutres
  border: '#1F2937',
  borderDark: '#374151',

  // Overlay
  overlay: 'rgba(0,0,0,0.7)',
};

// Raccourci — kolchi kaysta3mel `colors` w kaybdel automatiquement
export let colors = lightColors;

export function setThemeColors(isDark) {
  colors = isDark ? darkColors : lightColors;
}

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, round: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};