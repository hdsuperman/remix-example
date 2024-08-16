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
  const cookie = request.headers.get('Cookie');
  console.log('cookie:', cookie);
  return { lang: 'en', theme: 'dark' };
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
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
