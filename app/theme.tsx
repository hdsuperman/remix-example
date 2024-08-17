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

function removeCookieTheme() {
  document.cookie = serialize('theme', '', { path: '/', secure: true, maxAge: -1 });
}

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const data = useRouteLoaderData<{ theme: Theme }>('root');
  const [theme, setTheme] = useState<Theme>(data?.theme ?? 'light');

  useEffect(() => {
    switch (data?.theme) {
      case 'light': {
        setTheme('light');
        setCookieTheme('light');
        document.documentElement.classList.remove('dark');
        break;
      }
      case 'dark': {
        setTheme('dark');
        setCookieTheme('dark');
        document.documentElement.classList.add('dark');
        break;
      }
      default: {
        setTheme('system');
        removeCookieTheme();
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        if (systemTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (systemTheme === 'light') {
          document.documentElement.classList.remove('dark');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      changeTheme: (newTheme: Theme) => {
        if (newTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
          setTheme(newTheme);
          setCookieTheme(newTheme);
          document.documentElement.classList.add('dark');
          return;
        }
        if (newTheme === 'light' && document.documentElement.classList.contains('dark')) {
          setTheme(newTheme);
          setCookieTheme(newTheme);
          document.documentElement.classList.remove('dark');
          return;
        }
        if (newTheme === 'system') {
          setTheme(newTheme);
          removeCookieTheme();
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          if (systemTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (systemTheme === 'light') {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }),
    [theme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
