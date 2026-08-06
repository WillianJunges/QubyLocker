export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  danger: string;
  dangerText: string;
  link: string;
  successBg: string;
  successText: string;
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#D1D5DB',
  primary: '#0369A1',
  primaryText: '#FFFFFF',
  danger: '#DC2626',
  dangerText: '#FFFFFF',
  link: '#0369A1',
  successBg: '#DCFCE7',
  successText: '#166534',
};

export const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  border: '#334155',
  primary: '#38BDF8',
  primaryText: '#0F172A',
  danger: '#F87171',
  dangerText: '#0F172A',
  link: '#38BDF8',
  successBg: '#14532D',
  successText: '#86EFAC',
};
