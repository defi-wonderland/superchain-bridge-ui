import { useMemo } from 'react';
import { WalletClient, createWalletClient, http } from 'viem';
import { walletActionsL1, walletActionsL2 } from 'viem/op-stack';

import { useChain } from '~/hooks';
import { alchemyUrls } from '~/utils';

export const useCustomClient = () => {
  const { fromChain, toChain } = useChain();

  const fromProvider = useMemo(
    () =>
      createWalletClient({
        chain: fromChain,
        transport: http(alchemyUrls[fromChain.id]),
      }),
    [fromChain],
  );

  const toProvider = useMemo(
    () =>
      createWalletClient({
        chain: toChain,
        transport: http(alchemyUrls[toChain.id]),
      }),
    [toChain],
  );

  // const providers: Providers = useMemo(async () => {
  //   if (transactionType === TransactionType.DEPOSIT) {
  //     return {
  //       from: {
  //         wallet: fromProvider.extend(walletActionsL1()),
  //         public: fromProvider.extend(publicActionsL1()),
  //       },
  //       to: {
  //         wallet: toProvider.extend(walletActionsL2()),
  //         public: toProvider.extend(publicActionsL2()),
  //       },
  //     };
  //   } else if (transactionType === TransactionType.WITHDRAW) {
  //     return {
  //       from: {
  //         wallet: fromProvider.extend(walletActionsL2()),
  //         public: fromProvider.extend(publicActionsL2()),
  //       },
  //       to: {
  //         wallet: toProvider.extend(walletActionsL1()),
  //         public: toProvider.extend(publicActionsL1()),
  //       },
  //     };
  //   } else if (transactionType === TransactionType.BRIDGE) {
  //     return {
  //       from: {
  //         wallet: fromProvider.extend(walletActionsL2()),
  //         public: fromProvider.extend(publicActionsL2()),
  //       },
  //       to: {
  //         wallet: toProvider.extend(walletActionsL2()),
  //         public: toProvider.extend(publicActionsL2()),
  //       },
  //     };
  //   } else {
  //     return {
  //       from: fromProvider,
  //       to: toProvider,
  //     };
  //   }
  // }, [fromProvider, toProvider, transactionType]);

  const providers: Providers = useMemo(() => {
    return {
      from: {
        wallet: fromProvider.extend(walletActionsL1()) as WalletClient,
      },
      to: {
        wallet: toProvider.extend(walletActionsL2()),
      },
    };
  }, [fromProvider, toProvider]);

  return {
    providers,
  };
};

interface Providers {
  from: {
    wallet: WalletClient;
  };
  to: {
    wallet: WalletClient;
  };
}
