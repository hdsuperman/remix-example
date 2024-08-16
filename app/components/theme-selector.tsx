import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from '@remix-run/react';

export default function ThemeSelector() {
  const data = useRouteLoaderData<{ theme: string }>('root');
  const { t } = useTranslation('common');
  return (
    <select defaultValue={data?.theme} className="p-2 block" onChange={async (e) => {}}>
      <option value="dark">{t('theme.dark')}</option>
      <option value="light">{t('theme.light')}</option>
    </select>
  );
}
