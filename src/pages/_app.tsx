import '~/assets/font/css/general-sans.css';
import '@fontsource-variable/roboto-mono';
import '~/i18n';

import { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

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

export default Home;
