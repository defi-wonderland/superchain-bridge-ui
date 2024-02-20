import { sepolia, optimismSepolia, baseSepolia } from 'viem/chains';

import sepoliaLogo from '~/assets/chains/ethereum.svg';
import opSepoliaLogo from '~/assets/chains/optimism.svg';
import baseSepoliaLogo from '~/assets/chains/base.svg';

export const chainLogos: { [k: number]: string } = {
  [sepolia.id]: sepoliaLogo.src,
  [optimismSepolia.id]: opSepoliaLogo.src,
  [baseSepolia.id]: baseSepoliaLogo.src,
};

export const getChainLogo = (chainId: number) => {
  return chainLogos[chainId];
};
