import { Address, GetLogsReturnType, PublicClient, TransactionReceipt, WalletClient } from 'viem';
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
  messagePassedAbi,
  sentMessageABI,
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

export enum ForceTransactionType {
  ETH_WITHDRAWAL = 'ethWithdrawal',
  ERC20_WITHDRAWAL = 'erc20Withdrawal',
  ETH_TRANSFER = 'ethTransfer',
  ERC20_TRANSFER = 'erc20Transfer',
}

export type DepositLogs = {
  logs: GetLogsReturnType<typeof transactionDepositedABI>;
  receipts: TransactionReceipt[];
};

export type WithdrawLogs = {
  logs: GetLogsReturnType<
    typeof messagePassedAbi | typeof erc20BridgeInitiatedABI | typeof ethBridgeInitiatedABI | typeof sentMessageABI
  >;
  receipts: TransactionReceipt[];
  status: GetWithdrawalStatusReturnType[];
};
