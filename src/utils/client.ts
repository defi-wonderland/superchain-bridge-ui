import { createWeb3Modal } from '@web3modal/wagmi/react';
import { injected, walletConnect } from 'wagmi/connectors';
import { createConfig } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { Transport, http } from 'viem';
import { sepolia, optimismSepolia, baseSepolia } from 'viem/chains';

import { getConfig } from '~/config';

const { ALCHEMY_KEY, PROJECT_ID } = getConfig();

export const alchemyUrls: { [k: string]: string } = {
  [optimismSepolia.id]: `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [baseSepolia.id]: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  // [optimism.id]: `https://optimism-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  // [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  // [base.id]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

const networkId = Number(process.env.NEXT_PUBLIC_NETWORK ?? sepolia.id);
export const defaultChain = Object.values(wagmiChains).find((chain) => chain.id === networkId) ?? sepolia;

const isE2E = process.env.NEXT_PUBLIC_IS_E2E === 'true';

export const supportedChains = isE2E
  ? ([sepolia, optimismSepolia] as const)
  : ([sepolia, optimismSepolia, baseSepolia] as const);

export const connectors = [injected(), walletConnect({ projectId: PROJECT_ID })];

const trasnport: Record<[wagmiChains.Chain, ...wagmiChains.Chain[]][number]['id'], Transport> = Object.fromEntries(
  Object.entries(alchemyUrls).map(([chainId, url]) => [chainId, http(url)]),
);

export const config = createConfig({
  chains: supportedChains,
  connectors,
  transports: trasnport,
  batch: { multicall: true },
  ssr: true,
});

createWeb3Modal({ wagmiConfig: config, projectId: PROJECT_ID });
