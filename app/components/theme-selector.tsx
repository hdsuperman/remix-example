import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '@/theme';

export default function ThemeSelector() {
  const { theme, changeTheme } = useTheme();
  const { t } = useTranslation('common');
  return (
    <select
      defaultValue={theme}
      className="p-2 block"
      onChange={(e) => changeTheme(e.target.value as Theme)}
    >
      <option value="dark">{t('theme.dark')}</option>
      <option value="light">{t('theme.light')}</option>
    </select>
  );
}
