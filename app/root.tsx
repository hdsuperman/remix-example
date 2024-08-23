import './tailwind.css';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { ReactNode } from 'react';
import cookie from 'cookie';
import { I18nextProvider } from 'react-i18next';
import i18next, { changeLanguage } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { QueryProvider } from '@/query';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const parsed = cookie.parse(request.headers.get('Cookie') ?? '');
  const i18nextCookie = parsed.i18next;
  const acceptLanguage = request.headers.get('Accept-Language')?.split(',')[0];
  const lang = i18nextCookie ?? acceptLanguage ?? 'en';
  await changeLanguage(lang);
  return { lang, theme: parsed.theme ?? 'system' };
};

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');

  return (
    <html lang={data?.lang} className={data?.theme === 'dark' ? 'dark' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <I18nextProvider i18n={i18next}>
            <QueryProvider>{children}</QueryProvider>
          </I18nextProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
