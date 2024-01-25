import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { CssBaseline } from '@mui/material';
import { AppProps } from 'next/app';
import '~/i18n';

import { ModalProvider, StateProvider, ThemeProvider } from '~/providers';
import { Web3Modal } from '~/components';
import Layout from './layout';

const Home = ({ Component, pageProps }: AppProps) => {
  return (
    <AppCacheProvider {...pageProps}>
      <ModalProvider>
        <Web3Modal>
          <StateProvider>
            <ThemeProvider>
              <Layout>
                <>
                  <CssBaseline />
                  <Component {...pageProps}></Component>
                </>
              </Layout>
            </ThemeProvider>
          </StateProvider>
        </Web3Modal>
      </ModalProvider>
    </AppCacheProvider>
  );
};

export default Home;
