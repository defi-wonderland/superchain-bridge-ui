import { sepolia, mainnet } from 'viem/chains';
import { base, baseSepolia, optimism, optimismSepolia, fraxtal, zora, zoraSepolia } from 'viem/op-stack';
import { OpContracts } from '~/types';

const l2Contracts: OpContracts = {
  standardBridge: '0x4200000000000000000000000000000000000010',
  crossDomainMessenger: '0x4200000000000000000000000000000000000007',
  l2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
};

export const contracts: { [key: string]: OpContracts } = {
  // ------------------ L1 to L2 ------------------
  // ethereum-->optimism
  // docs: https://docs.optimism.io/chain/addresses
  [`${mainnet.id}-${optimism.id}`]: {
    standardBridge: optimism.contracts.l1StandardBridge[mainnet.id].address,
    crossDomainMessenger: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
    portal: optimism.contracts.portal[mainnet.id].address,
  },

  // ethereum-->base
  // https://docs.base.org/base-contracts/
  [`${mainnet.id}-${base.id}`]: {
    standardBridge: base.contracts.l1StandardBridge[mainnet.id].address,
    crossDomainMessenger: '0x866E82a600A1414e583f7F13623F1aC5d58b0Afa',
    portal: base.contracts.portal[mainnet.id].address,
  },

  // ethereum-->fraxtal
  // docs: https://docs.frax.com/fraxtal/addresses/fraxtal-contracts
  [`${mainnet.id}-${fraxtal.id}`]: {
    standardBridge: fraxtal.contracts.l1StandardBridge[mainnet.id].address,
    crossDomainMessenger: '0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed',
    portal: fraxtal.contracts.portal[mainnet.id].address,
  },

  // ethereum-->zora
  // docs: https://docs.zora.co/docs/zora-network/network
  [`${mainnet.id}-${zora.id}`]: {
    standardBridge: zora.contracts.l1StandardBridge[mainnet.id].address,
    crossDomainMessenger: '0x363B4B1ADa52E50353f746999bd9E94395190d2C',
    portal: zora.contracts.portal[mainnet.id].address,
  },

  // sepolia-->opSepolia
  [`${sepolia.id}-${optimismSepolia.id}`]: {
    standardBridge: optimismSepolia.contracts.l1StandardBridge[sepolia.id].address,
    crossDomainMessenger: '0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef',
    portal: optimismSepolia.contracts.portal[sepolia.id].address,
  },

  // sepolia-->baseSepolia
  [`${sepolia.id}-${baseSepolia.id}`]: {
    standardBridge: baseSepolia.contracts.l1StandardBridge[sepolia.id].address,
    crossDomainMessenger: '0xC34855F4De64F1840e5686e64278da901e261f20',
    portal: baseSepolia.contracts.portal[sepolia.id].address,
  },

  // ------------------ L2 to L1 ------------------

  // optimism-->ethereum
  [`${optimism.id}-${mainnet.id}`]: l2Contracts,

  // base-->ethereum
  [`${base.id}-${mainnet.id}`]: l2Contracts,

  // zora-->ethereum
  [`${zora.id}-${mainnet.id}`]: l2Contracts,

  // opSepolia-sepolia
  [`${optimismSepolia.id}-${sepolia.id}`]: l2Contracts,

  // baseSepolia-sepolia
  [`${baseSepolia.id}-${sepolia.id}`]: l2Contracts,

  // zoraSepolia-->sepolia
  [`${zoraSepolia.id}-${sepolia.id}`]: l2Contracts,
};
