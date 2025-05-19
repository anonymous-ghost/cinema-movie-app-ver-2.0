import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationUK from './locales/uk.json';

// Ресурси для різних мов
const resources = {
  en: {
    translation: translationEN
  },
  uk: {
    translation: translationUK
  }
};

i18n
  // Використовуємо детектор мови
  .use(LanguageDetector)
  // Інтегруємо з React
  .use(initReactI18next)
  // Ініціалізуємо i18next
  .init({
    resources,
    fallbackLng: 'en', // Мова за замовчуванням, якщо переклад не знайдено
    defaultNS: 'translation',
    lng: 'en', // Встановлюємо англійську мову за замовчуванням
    interpolation: {
      escapeValue: false, // Це важливо для HTML-вмісту
    }
  });

export default i18n; 