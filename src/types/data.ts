export interface TokenData {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions?: {
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
