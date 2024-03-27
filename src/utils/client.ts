import { injected, walletConnect } from 'wagmi/connectors';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

import * as wagmiChains from 'wagmi/chains';
import { Transport, http } from 'viem';
import { sepolia, mainnet } from 'viem/chains';
import { optimismSepolia, baseSepolia, optimism, base, zora, fraxtal } from 'viem/op-stack';

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

const isTest = process.env.NEXT_PUBLIC_IS_TEST !== 'false';

export const supportedChains = isTest
  ? ([sepolia, optimismSepolia, baseSepolia] as const)
  : ([mainnet, optimism, base, zora, fraxtal] as const);

export const connectors = [injected(), walletConnect({ projectId: PROJECT_ID })];

const transport: Record<[wagmiChains.Chain, ...wagmiChains.Chain[]][number]['id'], Transport> = Object.fromEntries(
  Object.entries(alchemyUrls).map(([chainId, url]) => [chainId, http(url)]),
);

export const config = getDefaultConfig({
  appName: 'Superchain Bridge',
  projectId: PROJECT_ID,
  chains: supportedChains,
  transports: transport,
  batch: { multicall: true },
  ssr: true,
});
