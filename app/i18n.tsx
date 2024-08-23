import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '@/locales/en';
import zh from '@/locales/zh';
import { ReactNode } from 'react';

export const resources = { en, zh } as const;
export const defaultNS = 'common';

// eslint-disable-next-line import/no-named-as-default-member
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    detection: { caches: ['cookie'] },
    supportedLngs: ['en', 'zh'],
    fallbackLng: 'en',
    fallbackNS: defaultNS,
    defaultNS,
  })
  .then(() => console.log('i18next initialized'));

export async function changeLanguage(lng: string) {
  // eslint-disable-next-line import/no-named-as-default-member
  await i18next.changeLanguage(lng);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
