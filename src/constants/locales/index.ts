import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import ar from './ar.json';
import en from './en.json';

const locale = Localization.getLocales()[0]?.languageCode || 'ar';
const isRTL = locale === 'ar';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: locale,
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
