import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { optimismSepolia, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

import { getConfig } from './config';
import { App } from './App';

const queryClient = new QueryClient();

const { ALCHEMY_KEY, PROJECT_ID } = getConfig();

export const config = createConfig({
  chains: [sepolia, optimismSepolia],
  connectors: [injected(), walletConnect({ projectId: PROJECT_ID })],
  transports: {
    [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reactApp: any = (
  <React.StrictMode>
    <BrowserRouter>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(reactApp);
