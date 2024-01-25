import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { optimismSepolia } from 'viem/chains';
import { publicActionsL2, walletActionsL2 } from 'viem/op-stack';
import { getConfig } from '~/config';

export const useL2Client = () => {
  const { ALCHEMY_KEY } = getConfig();
  const { address } = useAccount();

  const publicClientL2 = createPublicClient({
    chain: optimismSepolia,
    transport: http(`https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  }).extend(publicActionsL2());

  const walletClientL2 = useMemo(() => {
    if (typeof window !== 'undefined') {
      return createWalletClient({
        account: address,
        chain: optimismSepolia,
        transport: custom(window?.ethereum),
      }).extend(walletActionsL2());
    }
  }, [address]);

  return { publicClientL2, walletClientL2 };
};
