import { useMemo } from 'react';
import { WalletClient, createWalletClient, custom, http } from 'viem';
import { useAccount } from 'wagmi';
import {
  walletActionsL1,
  walletActionsL2,
  publicActionsL1,
  publicActionsL2,
  WalletActionsL1,
  WalletActionsL2,
  PublicActionsL1,
  PublicActionsL2,
} from 'viem/op-stack';

import { useChain } from '~/hooks';
import { alchemyUrls } from '~/utils';

interface Providers {
  from?: WalletClient & (WalletActionsL1 & WalletActionsL2);
  to: WalletClient & (PublicActionsL2 & PublicActionsL1);
}

export const useCustomClient = () => {
  const { address } = useAccount();
  const { fromChain, toChain } = useChain();

  const fromProvider = useMemo(() => {
    if (typeof window !== 'undefined') {
      return createWalletClient({
        account: address,
        chain: fromChain,
        transport: custom(window.ethereum),
      });
    }
  }, [address, fromChain]);

  const toProvider = useMemo(
    () =>
      createWalletClient({
        account: address,
        chain: toChain,
        transport: http(alchemyUrls[toChain.id]),
      }),
    [address, toChain],
  );

  const customClient: Providers = useMemo(
    () => ({
      from: fromProvider?.extend(walletActionsL1()).extend(walletActionsL2()),
      to: toProvider.extend(publicActionsL2()).extend(publicActionsL1()),
    }),
    [fromProvider, toProvider],
  );

  return {
    customClient,
  };
};
