import { createWeb3Modal } from '@web3modal/wagmi/react';
import { injected, walletConnect } from 'wagmi/connectors';
import { createConfig } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { http } from 'viem';
import { sepolia, optimismSepolia, baseSepolia } from 'viem/chains';

import { getConfig } from '~/config';

const { ALCHEMY_KEY, PROJECT_ID } = getConfig();

const networkId = Number(process.env.NEXT_PUBLIC_NETWORK ?? sepolia.id);
export const defaultChain = Object.values(wagmiChains).find((chain) => chain.id === networkId) ?? sepolia;

const isE2E = process.env.NEXT_PUBLIC_IS_E2E === 'false';

export const supportedChains = isE2E
  ? ([sepolia, optimismSepolia] as const)
  : ([sepolia, optimismSepolia, baseSepolia] as const);

export const connectors = [injected(), walletConnect({ projectId: PROJECT_ID })];

const transports = {
  [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  // [optimism.id]: http(`https://optimism-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  // [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
};

export const config = createConfig({
  chains: supportedChains,
  connectors,
  transports,
  batch: { multicall: true },
  ssr: true,
});

createWeb3Modal({ wagmiConfig: config, projectId: PROJECT_ID });
