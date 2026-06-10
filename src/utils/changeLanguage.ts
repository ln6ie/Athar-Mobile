import i18n from 'i18next';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';

export const changeLanguage = async (lang: 'ar' | 'en') => {
  try {
    await SecureStore.setItemAsync('athar_language_code', lang);
  } catch (err) {
    console.error('[changeLanguage] Failed to persist language selection', err);
  }
  await i18n.changeLanguage(lang);
};

export const initializeLanguage = async () => {
  try {
    const savedLang = await SecureStore.getItemAsync('athar_language_code');
    if (savedLang === 'ar' || savedLang === 'en') {
      await i18n.changeLanguage(savedLang);
    } else {
      // Default to device system language
      const systemLocale = Localization.getLocales()[0]?.languageCode || 'ar';
      const defaultLang = (systemLocale === 'ar' || systemLocale === 'en') ? systemLocale : 'ar';
      await i18n.changeLanguage(defaultLang);
    }
  } catch (err) {
    console.error('[initializeLanguage] Failed to initialize persistent language', err);
  }
};

