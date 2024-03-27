import { rainbowWallet, walletConnectWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import * as wagmiChains from 'wagmi/chains';
import { createConfig, cookieStorage, createStorage } from 'wagmi';
import { Transport, http } from 'viem';
import { sepolia, mainnet } from 'viem/chains';
import { optimismSepolia, baseSepolia, optimism, base, zora, fraxtal } from 'viem/op-stack';

import { getConfig } from '~/config';

const { ALCHEMY_KEY, PROJECT_ID } = getConfig();

export const alchemyUrls: { [k: string]: string } = {
  // mainnet
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [fraxtal.id]: `https://frax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [zora.id]: `https://zora-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,

  // testnets
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [optimismSepolia.id]: `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [baseSepolia.id]: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

const networkId = Number(process.env.NEXT_PUBLIC_NETWORK ?? sepolia.id);
export const defaultChain = Object.values(wagmiChains).find((chain) => chain.id === networkId) ?? sepolia;

const isTest = process.env.NEXT_PUBLIC_IS_TEST !== 'false';

export const supportedChains = isTest
  ? ([sepolia, optimismSepolia, baseSepolia] as const)
  : ([mainnet, optimism, base] as const);

const getWallets = () => {
  if (PROJECT_ID) {
    return [injectedWallet, walletConnectWallet, rainbowWallet];
  } else {
    return [injectedWallet];
  }
};

export const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: getWallets(),
    },
  ],
  {
    appName: 'Superchain Bridge',
    projectId: PROJECT_ID,
  },
);

const transport: Record<[wagmiChains.Chain, ...wagmiChains.Chain[]][number]['id'], Transport> = Object.fromEntries(
  Object.entries(alchemyUrls).map(([chainId, url]) => [chainId, http(url)]),
);

export const config = createConfig({
  chains: supportedChains,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: transport,
  batch: { multicall: true },
  connectors,
});
