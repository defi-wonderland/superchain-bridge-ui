import '@fontsource-variable/inter';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { Web3Modal } from '~/components';
import { ThemeProvider } from '~/providers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reactApp: any = (
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Web3Modal>
          <App />
        </Web3Modal>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(reactApp);
