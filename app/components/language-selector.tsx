import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n';
import { useRouteLoaderData } from '@remix-run/react';

export default function LanguageSelector() {
  const { t } = useTranslation('common');
  const data = useRouteLoaderData<{ lang: string }>('root');
  return (
    <select
      className="p-2 block border rounded-xl mt-3"
      defaultValue={data?.lang}
      onChange={async (e) => {
        await changeLanguage(e.target.value);
      }}
    >
      <option value="zh">{t('lang.zh')}</option>
      <option value="en">{t('lang.en')}</option>
    </select>
  );
}
