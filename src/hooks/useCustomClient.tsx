import { useMemo } from 'react';
import { createWalletClient, http } from 'viem';
// import { optimismSepolia, publicActionsL1, publicActionsL2, walletActionsL1, walletActionsL2 } from 'viem/op-stack';
// import { useAccount } from 'wagmi';
// import { sepolia } from 'viem/chains';

// import { getConfig } from '~/config';
import { useChain } from '~/hooks';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  BRIDGE = 'bridge',
  SWAP = 'swap',
}

export const useCustomClient = () => {
  const { fromChain, toChain } = useChain();
  // const { address } = useAccount();
  // const { ALCHEMY_KEY } = getConfig();
  // const account = useAccount();

  const isFromAnL2 = !!fromChain?.sourceId;
  const isToAnL2 = !!toChain?.sourceId;

  const transactionType = useMemo(() => {
    if (isFromAnL2 && isToAnL2) {
      return TransactionType.BRIDGE;
    } else if (isFromAnL2 && !isToAnL2) {
      return TransactionType.WITHDRAW;
    } else if (!isFromAnL2 && isToAnL2) {
      return TransactionType.DEPOSIT;
    } else {
      return TransactionType.SWAP;
    }
  }, [isFromAnL2, isToAnL2]);

  const fromProvider = createWalletClient({
    chain: fromChain,
    transport: http(),
  });

  const toProvider = createWalletClient({
    chain: toChain,
    transport: http(),
  });

  // const publicClientL1 = createPublicClient({
  //   chain: sepolia,
  //   transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  //   batch: {
  //     multicall: true,
  //   },
  // }).extend(publicActionsL1());

  // const walletClientL1 = useMemo(() => {
  //   if (typeof window !== 'undefined') {
  //     return createWalletClient({
  //       account: address,
  //       chain: sepolia,
  //       transport: custom(window.ethereum),
  //     }).extend(walletActionsL1());
  //   }
  // }, [address]);

  // const publicClientL2 = createPublicClient({
  //   chain: optimismSepolia,
  //   transport: http(`https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  //   batch: {
  //     multicall: true,
  //   },
  // }).extend(publicActionsL2());

  // const walletClientL2 = useMemo(() => {
  //   if (typeof window !== 'undefined') {
  //     return createWalletClient({
  //       account: address,
  //       chain: optimismSepolia,
  //       transport: custom(window.ethereum),
  //     }).extend(walletActionsL2());
  //   }
  // }, [address]);

  return {
    transactionType,
    isFromAnL2,
    isToAnL2,
    fromProvider,
    toProvider,
    // provider: {
    //   l1: {
    //     public: publicClientL1,
    //     wallet: walletClientL1,
    //   },
    //   l2: {
    //     public: publicClientL2,
    //     wallet: walletClientL2,
    //   },
    // },
  };
};
