import { Address, Hex, PublicClient, TransactionReceipt, WalletClient } from 'viem';
import { WalletActionsL1, WalletActionsL2, PublicActionsL1, PublicActionsL2 } from 'viem/op-stack';
import { Args } from '~/utils';

export interface OpContracts {
  standardBridge: Address;
  crossDomainMessenger: Address;
  portal?: Address;
  l2ToL1MessagePasser?: Address;
}

export interface CustomClients {
  from: {
    wallet?: WalletClient & (WalletActionsL1 & WalletActionsL2);
    public: PublicClient & (PublicActionsL2 & PublicActionsL1);
    contracts: OpContracts; // contracts for the from chain
  };
  to: {
    wallet?: WalletClient & (WalletActionsL1 & WalletActionsL2);
    public: PublicClient & (PublicActionsL2 & PublicActionsL1);
    contracts: OpContracts; // contracts for the to chain
  };
}

export interface TokenData {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  cctp?: boolean;
  extensions: {
    optimismBridgeAddress?: string;
    baseBridgeAddress?: string;
    opListId?: string;
    opTokenId?: string;
  };
}

export enum TransactionType {
  NONE = '',
  // OP Canonical Bridge
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
  PROVE = 'Prove withdrawal',
  FINALIZE = 'Finalize withdrawal',
  REPLAY = 'Replay transaction',

  // CCTP
  CCTP = 'Cross-Chain Transfer',
  FINALIZE_CCTP = 'Mint USDC',

  // Other
  BRIDGE = 'Bridge',
  SWAP = 'Swap',
}

export type CustomTransactionType = 'custom-tx' | 'force-withdrawal' | 'force-transfer';

export interface AccountLogs {
  blockNumber: bigint;
  timestamp: bigint | number;
  transactionHash: string;
  l2TransactionHash?: string;
  type: string;
  originChain: number;
  destinationChain: number;
  bridge: string;
  fees: string;
  transactionTime: string;
  status: string;
  from: Address;
  receipt: TransactionReceipt;
  to: Address;
  localToken?: Address;
  remoteToken?: Address;
  amount?: bigint;
  data?: Hex;
  args?: Args;
}

export type DepositLogs = {
  accountLogs: AccountLogs[];
};

export type WithdrawLogs = {
  accountLogs: AccountLogs[];
};

export interface RelayMessageArgs {
  messageNonce: bigint;
  sender: Address;
  target: Address;
  value: bigint;
  gasLimit: bigint;
  message: Address;
}

export enum TransactionStep {
  NONE = 'None',
  INITIATE = 'Initiate Transaction',
  PROCESSING = 'Processing Transaction',
  REPLAYING = 'Replaying Transaction',
  FINALIZED = 'Finalized Transaction',
}

export interface TransactionMetadata {
  step: TransactionStep;
  sourceHash?: string;
  destinationHash?: string;
}
