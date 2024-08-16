import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import en from '@/locales/en';
import zh from '@/locales/zh';

export const resources = { en, zh } as const;
export const defaultNS = 'common';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.ts`)))
  .init({
    detection: { caches: ['cookie'] },
    supportedLngs: ['en', 'zh'],
    fallbackLng: 'en',
    fallbackNS: defaultNS,
    defaultNS,
  })
  .then(() => console.log('i18next initialized'));

export default i18next;
