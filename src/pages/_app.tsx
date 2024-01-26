import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { AppProps } from 'next/app';
import '~/i18n';

import { Providers } from '~/providers';
import Layout from './layout';

const Home = ({ Component, pageProps }: AppProps) => {
  return (
    <AppCacheProvider {...pageProps}>
      <Providers>
        <Layout>
          <Component {...pageProps}></Component>
        </Layout>
      </Providers>
    </AppCacheProvider>
  );
};

export default Home;
