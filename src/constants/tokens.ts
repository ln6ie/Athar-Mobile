// رموز التصميم الأساسية - الألوان والثيمات حسب النظام
import { Platform, PlatformColor, ColorValue } from 'react-native';

const getNativeColor = (iosName: string, fallback: string): ColorValue => {
  return Platform.select({
    ios: PlatformColor(iosName),
    default: fallback as any,
  }) as ColorValue;
};

export const LIGHT_COLORS = {
  background: {
    default: getNativeColor('systemGroupedBackground', '#F2F2F7'), // لون خلفية النظام المجمعة
    card: getNativeColor('secondarySystemGroupedBackground', '#FFFFFF'), // لون خلفية البطاقات الفرعية بالنظام
    input: getNativeColor('systemGray6', '#E5E5EA'), // لون الإدخال الرمادي الفاخر للنظام
  },
  brand: {
    gold: getNativeColor('systemBlue', '#0055A5'), // اللون الرئيسي
    goldMuted: '#1A365D',
  },
  feedback: {
    error: getNativeColor('systemRed', '#EF4444'),
    success: getNativeColor('systemGreen', '#10B981'),
    warning: getNativeColor('systemOrange', '#F59E0B'),
    info: getNativeColor('systemBlue', '#3B82F6'),
  },
  text: {
    primary: getNativeColor('label', '#000000'), // لون النصوص الرئيسية للنظام
    secondary: getNativeColor('secondaryLabel', '#3A3A3C'), // لون النصوص الفرعية بالنظام
    disabled: getNativeColor('placeholderText', '#8E8E93'), // لون نصوص التلميح بالنظام
  },
  border: {
    muted: getNativeColor('separator', '#D1D1D6'), // لون الفواصل
    focus: getNativeColor('systemBlue', '#0055A5'),
  }
};

export const DARK_COLORS = {
  background: {
    default: getNativeColor('systemGroupedBackground', '#000000'), // لون خلفية النظام المجمعة الداكنة (أسود ناصع)
    card: getNativeColor('secondarySystemGroupedBackground', '#1C1C1E'), // لون خلفية البطاقات الفرعية الداكنة
    input: getNativeColor('systemGray6', '#2C2C2E'),
  },
  brand: {
    gold: getNativeColor('systemBlue', '#3B82F6'),
    goldMuted: '#60A5FA',
  },
  feedback: {
    error: getNativeColor('systemRed', '#EF4444'),
    success: getNativeColor('systemGreen', '#10B981'),
    warning: getNativeColor('systemOrange', '#F59E0B'),
    info: getNativeColor('systemBlue', '#3B82F6'),
  },
  text: {
    primary: getNativeColor('label', '#FFFFFF'),
    secondary: getNativeColor('secondaryLabel', '#AEAEB2'),
    disabled: getNativeColor('placeholderText', '#636366'),
  },
  border: {
    muted: getNativeColor('separator', '#38383A'),
    focus: getNativeColor('systemBlue', '#3B82F6'),
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
