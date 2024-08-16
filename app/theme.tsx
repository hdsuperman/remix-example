'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { serialize } from 'cookie';
import { useRouteLoaderData } from '@remix-run/react';

export type Theme = 'light' | 'dark';

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
  const [theme, setTheme] = useState<Theme>(data?.theme ?? 'light');

  useEffect(() => {
    switch (data?.theme) {
      case 'light': {
        setTheme('light');
        setCookieTheme('light');
        break;
      }
      case 'dark': {
        setTheme('dark');
        setCookieTheme('dark');
        break;
      }
      default:
        setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      theme,
      changeTheme: (newTheme: Theme) => {
        if (newTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.add('dark');
        }
        if (newTheme === 'light' && document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
        }
        setTheme(newTheme);
        setCookieTheme(newTheme);
      },
    }),
    [theme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
