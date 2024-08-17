'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { serialize } from 'cookie';
import { useRouteLoaderData } from '@remix-run/react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>(null!);

export function useTheme() {
  return useContext(ThemeContext);
}

function setCookieTheme(theme: Theme) {
  document.cookie = serialize('theme', theme, { path: '/', secure: true });
}

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const data = useRouteLoaderData<{ theme: Theme }>('root');
  const [theme, setTheme] = useState<Theme>(data?.theme ?? 'system');

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      changeTheme: (newTheme: Theme) => {
        setTheme(newTheme);
        setCookieTheme(newTheme);
        if (newTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.add('dark');
        }
        if (newTheme === 'light' && document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
        }
        if (newTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          if (systemTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.add('dark');
          } else if (
            systemTheme === 'light' &&
            document.documentElement.classList.contains('dark')
          ) {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }),
    [theme]
  );

  useEffect(() => {
    value.changeTheme(data?.theme ?? 'system');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (value.theme !== 'system') return;
      value.changeTheme('system');
    };
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [value]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
