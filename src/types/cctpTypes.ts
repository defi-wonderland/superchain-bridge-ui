import { Address, Hex } from 'viem';

export interface CctpType {
  [chain: string]: {
    domain: number;
    tokenMessenger: Address;
    messageTransmitter: Address;
    tokenMinter: Address;
  };
}

export type UsdcBurnData = {
  sourceBlockNumber: bigint;
  sourceHash: Hex;
  destinationBlockNumber?: bigint;
  destinationHash?: Hex;
  nonce: bigint | undefined;
  burnToken: Address | undefined;
  amount: bigint | undefined;
  depositor: Address | undefined;
  mintRecipient: Address;
  destinationDomain: number | undefined;
  destinationTokenMessenger: Address;
  destinationCaller: Address | undefined;
  received: boolean;
}[];
