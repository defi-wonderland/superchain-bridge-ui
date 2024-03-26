import '~/assets/font/css/general-sans.css';
import '@fontsource-variable/roboto-mono';

import { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { appWithTranslation } from 'next-i18next';

import { Providers } from '~/providers';
import Layout from './layout';

const Home = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default appWithTranslation(Home);
