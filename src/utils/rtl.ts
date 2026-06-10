// أدوات دعم الاتجاه من اليمين لليسار RTL
import { I18nManager } from 'react-native';

export function isArabicText(text: string): boolean {
  const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text.trim());
}

export function forceArabicLayout() {
  try {
    // تعطيل التقليب التلقائي RTL للحفاظ على سلوك التخطيط
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } catch (error) {
    console.error('فشل تهيئة تخطيط RTL', error);
  }
}
