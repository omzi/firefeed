'use client';

import { ReactNode } from 'react';
import Providers from '#/app/providers';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';
import { Next13ProgressBar } from 'next13-progressbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '#/app/fonts.css';
import '#/app/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

const queryClient = new QueryClient();

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang='en' className='font-satoshi font-normal antialiased' suppressHydrationWarning>
        <head>
          <link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />
          <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <meta name='apple-mobile-web-app-title' content='FireFeed' />
          <link rel='manifest' href='/manifest.webmanifest' />
          <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' />
        </head>
        <body>
          <Providers>
            <ToastContainer
              position='bottom-center'
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              draggable
              pauseOnHover
              theme='colored'
            />
            {children}
            <Next13ProgressBar
              height='3.5px'
              color='#5E17EB'
              options={{ showSpinner: false }}
              delay={0}
              startPosition={0.5}
              showOnShallow
            />
          </Providers>
          <Analytics />
        </body>
      </html>
    </QueryClientProvider>
  );
};

export default RootLayout;
