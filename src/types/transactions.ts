import { Address, Hex } from 'viem';
import { CustomClients, TransactionStep } from './data';

export interface ExecuteL1DepositProps {
  setTxStep: (val: TransactionStep) => void;
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
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  mint: bigint;
  to: Address;
}

export interface DepositERC20Props {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
  allowance: string;
  approve: () => Promise<void>;
}

export interface DepositMessageProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  target: Address;
  data: Hex;
}

// ------------------ Withdraw transactions ------------------

export interface InitiateWithdrawProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  mint: bigint;
  to: Address;
}

export interface InitiateERC20WithdrawProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
}

export interface InitiateMessageWithdrawProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  message: Hex;
}

// ------------------ Force transactions ------------------

export interface ForceEthTransferProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
}

export interface ForceErc20TransferProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
  tokenAddress: Address;
}

export interface ForceEthWithdrawalProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  amount: bigint;
}

export interface ForceErc20WithdrawalProps {
  setTxStep: (val: TransactionStep) => void;
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
}
