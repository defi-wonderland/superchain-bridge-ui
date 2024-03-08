import { Dispatch, SetStateAction } from 'react';
import { Address, Hex } from 'viem';
import { CustomClients, TransactionMetadata } from './data';

export interface ExecuteL1DepositProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  args: {
    amount: bigint;
    to: Address;
    gas: bigint;
    isCreation: boolean;
    data: Hex;
  };
}

export interface DepositETHProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  mint: bigint;
  to: Address;
}

export interface DepositERC20Props {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
  allowance: string;
  approve: () => Promise<void>;
}

export interface DepositMessageProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  target: Address;
  data: Hex;
}

// ------------------ Withdraw transactions ------------------

export interface InitiateWithdrawProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  mint: bigint;
  to: Address;
}

export interface InitiateERC20WithdrawProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
}

export interface InitiateMessageWithdrawProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  message: Hex;
}

// ------------------ Force transactions ------------------

export interface ForceEthTransferProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
}

export interface ForceErc20TransferProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
  tokenAddress: Address;
}

export interface ForceEthWithdrawalProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  amount: bigint;
}

export interface ForceErc20WithdrawalProps {
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
}
