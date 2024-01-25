import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import { publicActionsL1, walletActionsL1 } from 'viem/op-stack';

import { getConfig } from '~/config';

export const useL1Client = () => {
  const { ALCHEMY_KEY } = getConfig();
  const account = useAccount();

  const publicClientL1 = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  }).extend(publicActionsL1());

  const walletClientL1 = useMemo(() => {
    if (typeof window !== 'undefined') {
      return createWalletClient({
        account: account.address,
        chain: sepolia,
        transport: custom(window.ethereum),
      }).extend(walletActionsL1());
    }
  }, [account.address]);

  return { publicClientL1, walletClientL1 };
};
