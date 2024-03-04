import { ChainData, OpContracts } from '~/types';
import { base, baseSepolia, optimismSepolia, sepolia } from 'viem/chains';
import sepoliaLogo from '~/assets/chains/ethereum.svg';
import opSepoliaLogo from '~/assets/chains/optimism.svg';
import baseSepoliaLogo from '~/assets/chains/base.svg';

/*=============================================
=                Misc Variables               =
=============================================*/

export const THEME_KEY = 'superbridge_theme_key';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const chainData: ChainData = {
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
  [base.id]: {
    logo: baseSepoliaLogo.src,
    apiUrl: 'https://api.basescan.org/api',
    explorer: 'https://basescan.org//',
  },
};

export const contracts: { [key: string]: OpContracts } = {
  // -------- L1 --------

  // sepolia-opSepolia
  '11155111-11155420': {
    standardBridge: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
    crossDomainMessenger: '0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef',
    portal: '0x16Fc5058F25648194471939df75CF27A2fdC48BC',
  },
  // sepolia-baseSepolia
  '11155111-84532': {
    standardBridge: '0xfd0Bf71F60660E2f608ed56e1659C450eB113120',
    crossDomainMessenger: '0xC34855F4De64F1840e5686e64278da901e261f20',
    portal: '0x49f53e41452C74589E85cA1677426Ba426459e85',
  },

  // -------- L2 --------

  // opSepolia-sepolia
  '11155420-11155111': {
    standardBridge: '0x4200000000000000000000000000000000000010',
    crossDomainMessenger: '0x4200000000000000000000000000000000000007',
    l2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
  },
  // baseSepolia-sepolia
  '84532-11155111': {
    standardBridge: '0x4200000000000000000000000000000000000010',
    crossDomainMessenger: '0x4200000000000000000000000000000000000007',
    l2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
  },
  // baseSepolia-opSepolia
  '84532-11155420': {
    standardBridge: '0x0000000000000000000000000000000000000000',
    crossDomainMessenger: '0x0000000000000000000000000000000000000000',
    l2ToL1MessagePasser: '0x0000000000000000000000000000000000000000',
  },

  // -------- Temporary disabled --------
  // ethereum - optimism
  // '1-10': {
  //   standardBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
  //   crossDomainMessenger: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
  //   portal: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
  // },
  // // ethereum - base
  // '1-8453': {
  //   standardBridge: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
  //   crossDomainMessenger: '	0x866E82a600A1414e583f7F13623F1aC5d58b0Afa',
  //   portal: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
  // },
};

/*=============================================
=               Style Variables               =
=============================================*/

export const MOBILE_MAX_WIDTH = 600;
export const TABLET_MAX_WIDTH = 1024;

export const fontSize = {
  MAIN_TITLE: '5.2rem',
  SECTION_TITLE: '2.4rem',
  XL: '1.8rem',
  LARGE: '1.6rem',
  MEDIUM: '1.4rem',
  SMALL: '1.2rem',
};

export const zIndex = {
  HEADER: 100,
  MODAL: 200,
  BACKDROP: -1,
  TOAST: 500,
};
