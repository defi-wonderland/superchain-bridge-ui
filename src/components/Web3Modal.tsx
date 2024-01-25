import React from 'react';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { optimismSepolia, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getConfig } from '~/config';

const queryClient = new QueryClient();

const { ALCHEMY_KEY, PROJECT_ID } = getConfig();

const config = createConfig({
  chains: [sepolia, optimismSepolia],
  connectors: [injected(), walletConnect({ projectId: PROJECT_ID })],
  transports: {
    [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  },
  ssr: true,
});

createWeb3Modal({ wagmiConfig: config, projectId: PROJECT_ID });

export function Web3Modal({ children }: { children: React.ReactElement }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
