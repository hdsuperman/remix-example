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
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import cookie from 'cookie';
import i18next, { changeLanguage } from './i18n';
import { I18nextProvider } from 'react-i18next';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const parsed = cookie.parse(request.headers.get('Cookie') ?? '');
  const i18nextCookie = parsed.i18next;
  const acceptLanguage = request.headers.get('Accept-Language')?.split(',')[0];
  const lang = i18nextCookie ?? acceptLanguage ?? 'en';
  await changeLanguage(lang);
  return { lang, theme: parsed.theme ?? 'light' };
};

export function Layout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  const data = useRouteLoaderData<typeof loader>('root');

  return (
    <html lang={data?.lang} className={data?.theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nextProvider i18n={i18next}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </I18nextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
