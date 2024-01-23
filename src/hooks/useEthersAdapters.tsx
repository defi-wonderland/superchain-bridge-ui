import { useMemo } from 'react';

import { providers } from 'ethers';
import { useWalletClient } from 'wagmi';
import type { Account, Chain, Client, Transport } from 'viem';

export function walletClientToSigner(walletClient: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const client = useWalletClient({ chainId });
  return useMemo(() => (client.data ? walletClientToSigner(client.data) : undefined), [client.data]);
}
