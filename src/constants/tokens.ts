export const LIGHT_COLORS = {
  background: {
    default: '#FFFFFF',
    card: '#FFFFFF',
    input: '#F3F4F6',
  },
  brand: {
    gold: '#0055A5',
    goldMuted: '#1A365D',
  },
  feedback: {
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  text: {
    primary: '#000000',
    secondary: '#4B5563',
    disabled: '#9CA3AF',
  },
  border: {
    muted: '#E5E7EB',
    focus: '#0055A5',
  }
};

export const DARK_COLORS = {
  background: {
    default: '#0B0F19',
    card: '#131A2C',
    input: '#1E293B',
  },
  brand: {
    gold: '#3B82F6',
    goldMuted: '#60A5FA',
  },
  feedback: {
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    disabled: '#475569',
  },
  border: {
    muted: '#1E293B',
    focus: '#3B82F6',
  }
};

export const TOKENS = {
  colors: LIGHT_COLORS,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  }
} as const;
