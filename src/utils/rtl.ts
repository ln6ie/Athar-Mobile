import { I18nManager } from 'react-native';

export function isArabicText(text: string): boolean {
  const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text.trim());
}

export function forceArabicLayout() {
  try {
    // Disable native RTL auto-flipping unconditionally to keep layout behavior 100% predictable
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } catch (error) {
    console.error('Failed to configure RTL layout', error);
  }
}
