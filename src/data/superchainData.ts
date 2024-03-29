import {
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
  fraxtal,
  liskSepolia,
  zora,
  zoraSepolia,
} from 'viem/chains';

import sepoliaLogo from '~/assets/chains/ethereum.svg';
import opSepoliaLogo from '~/assets/chains/optimism.svg';
import baseSepoliaLogo from '~/assets/chains/base.svg';
import zoraLogo from '~/assets/chains/zora.png';
import fraxtalLogo from '~/assets/chains/fraxtal.png';
import liskLogo from '~/assets/chains/lisk.png';

import { ChainData } from '~/types';

export const chainData: ChainData = {
  // Mainnet
  [mainnet.id]: {
    logo: sepoliaLogo.src,
    apiUrl: 'https://etherscan.io/api',
    explorer: 'https://etherscan.io/',
  },
  [optimism.id]: {
    logo: opSepoliaLogo.src,
    apiUrl: 'https://api-optimistic.etherscan.io/api',
    explorer: 'https://optimistic.etherscan.io/',
  },
  [base.id]: {
    logo: baseSepoliaLogo.src,
    apiUrl: 'https://api.basescan.org/api',
    explorer: 'https://basescan.org/',
  },
  [zora.id]: {
    logo: zoraLogo.src,
    apiUrl: '',
    explorer: '',
  },
  [fraxtal.id]: {
    logo: fraxtalLogo.src,
    apiUrl: 'https://api.fraxscan.com/api',
    explorer: 'https://fraxscan.com/',
  },

  // Testnets
  [sepolia.id]: {
    logo: sepoliaLogo.src,
    apiUrl: 'https://api-sepolia.etherscan.io/api',
    explorer: 'https://sepolia.etherscan.io/',
  },
  [optimismSepolia.id]: {
    logo: opSepoliaLogo.src,
    apiUrl: 'https://api-sepolia-optimistic.etherscan.io/api',
    explorer: 'https://sepolia-optimism.etherscan.io/',
  },
  [baseSepolia.id]: {
    logo: baseSepoliaLogo.src,
    apiUrl: 'https://api-sepolia.basescan.org/api',
    explorer: 'https://sepolia.basescan.org/',
  },
  [zoraSepolia.id]: {
    logo: baseSepoliaLogo.src,
    apiUrl: '',
    explorer: '',
  },
  [liskSepolia.id]: {
    logo: liskLogo.src,
    apiUrl: '',
    explorer: '',
  },
};
