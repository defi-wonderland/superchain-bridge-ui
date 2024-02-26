import { Address, GetLogsReturnType, Hex, PublicClient, TransactionReceipt, WalletClient } from 'viem';
import {
  WalletActionsL1,
  WalletActionsL2,
  PublicActionsL1,
  PublicActionsL2,
  GetWithdrawalStatusReturnType,
} from 'viem/op-stack';
import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  failedRelayedMessageABI,
  messagePassedAbi,
  sentMessageExtensionABI,
  transactionDepositedABI,
} from '~/utils';

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
    wallet: WalletClient & (WalletActionsL1 & WalletActionsL2);
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
  extensions: {
    optimismBridgeAddress?: string;
    baseBridgeAddress?: string;
    opListId?: string;
    opTokenId?: string;
  };
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  BRIDGE = 'bridge',
  SWAP = 'swap',
}

export type CustomTransactionType = 'custom-tx' | 'force-withdrawal' | 'force-transfer';

export interface AccountLogs {
  blockNumber: bigint;
  date: string | number;
  transactionHash: string;
  type: string;
  originChain?: string;
  destinationChain?: string;
  bridge: string;
  fees: string;
  transactionTime: string;
  status: string;
  localToken?: Address;
  remoteToken?: Address;
  from: Address;
  to: Address;
  amount: bigint;
  data?: Hex;
}

export type DepositLogs = {
  accountLogs: AccountLogs[];
  logs: GetLogsReturnType<
    | typeof transactionDepositedABI
    | typeof ethBridgeInitiatedABI
    | typeof erc20BridgeInitiatedABI
    | typeof sentMessageExtensionABI
  >;
  receipts: TransactionReceipt[];
  msgHashes: Hex[];
  args: RelayMessageArgs[];
  failedTxs: GetLogsReturnType<typeof failedRelayedMessageABI>;
};

export type WithdrawLogs = {
  accountLogs: AccountLogs[];
  logs: GetLogsReturnType<
    | typeof messagePassedAbi
    | typeof erc20BridgeInitiatedABI
    | typeof ethBridgeInitiatedABI
    | typeof sentMessageExtensionABI
  >;
  receipts: TransactionReceipt[];
  status: GetWithdrawalStatusReturnType[];

  msgHashes: Hex[];
  args: RelayMessageArgs[];
  failedTxs: GetLogsReturnType<typeof failedRelayedMessageABI>;
};

export interface RelayMessageArgs {
  messageNonce: bigint;
  sender: Address;
  target: Address;
  value: bigint;
  gasLimit: bigint;
  message: Address;
}
