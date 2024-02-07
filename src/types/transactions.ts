import { Address, Hex } from 'viem';
import { CustomClients } from './data';

export interface ExecuteL1DepositProps {
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
  customClient: CustomClients;
  userAddress: Address;
  mint: bigint;
  to: Address;
}

export interface DepositERC20Props {
  customClient: CustomClients;
  userAddress: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
  allowance: string;
  approve: () => Promise<void>;
}

export interface DepositMessageProps {
  customClient: CustomClients;
  userAddress: Address;
  data: Hex;
}

// ------------------ Withdraw transactions ------------------

export interface InitiateWithdrawProps {
  customClient: CustomClients;
  userAddress: Address;
  mint: bigint;
  to: Address;
}

export interface InitiateERC20WithdrawProps {
  customClient: CustomClients;
  userAddress: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
}

export interface InitiateMessageWithdrawProps {
  customClient: CustomClients;
  userAddress: Address;
  message: Hex;
}

// ------------------ Force transactions ------------------

export interface ForceEthTransferProps {
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
}

export interface ForceErc20TransferProps {
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
  tokenAddress: Address;
}

export interface ForceEthWithdrawalProps {
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  amount: bigint;
}

export interface ForceErc20WithdrawalProps {
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  amount: bigint;
  l1TokenAddress: Address;
  l2TokenAddress: Address;
}
