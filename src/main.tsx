import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { Web3Modal } from '~/components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reactApp: any = (
  <React.StrictMode>
    <BrowserRouter>
      <Web3Modal>
        <App />
      </Web3Modal>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(reactApp);
