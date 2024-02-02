import { Address, Chain, Hex } from 'viem';
import { CustomClients, TokenData } from './data';

export interface DepositETHProps {
  customClient: CustomClients;
  mint: bigint;
  to: Address;
}

export interface DepositERC20Props {
  customClient: CustomClients;
  userAddress: Address;
  toChain: Chain;
  selectedToken: TokenData;
  amount: bigint;
  toTokens: TokenData[];
  allowance: string;
  approve: () => Promise<void>;
}

export interface DepositMessageProps {
  customClient: CustomClients;
  userAddress: Address;
  data: Hex;
}

export interface InitiateWithdrawProps {
  customClient: CustomClients;
  userAddress: Address;
  mint: bigint;
  to: Address;
}

export interface InitiateERC20WithdrawProps {
  customClient: CustomClients;
  userAddress: Address;
  selectedToken: TokenData;
  amount: bigint;
  toChain: Chain;
  toTokens: TokenData[];
}

export interface InitiateMessageWithdrawProps {
  customClient: CustomClients;
  userAddress: Address;
  message: Hex;
}
