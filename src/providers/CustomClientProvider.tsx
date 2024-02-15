import { useMemo, createContext } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { useAccount } from 'wagmi';
import { walletActionsL1, walletActionsL2, publicActionsL1, publicActionsL2 } from 'viem/op-stack';

import { useChain } from '~/hooks';
import { alchemyUrls, getFromContracts, getToContracts } from '~/utils';
import { CustomClients } from '~/types';

type ContextType = {
  customClient: CustomClients;
};

interface StateProps {
  children: React.ReactElement;
}

export const CustomClientConext = createContext({} as ContextType);

export const CustomClientProvider = ({ children }: StateProps) => {
  const { address } = useAccount();
  const { fromChain, toChain } = useChain();

  const fromWalletClient = useMemo(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return createWalletClient({
        account: address,
        chain: fromChain,
        transport: custom(window.ethereum),
      });
    }
  }, [address, fromChain]);

  const fromPublicClient = useMemo(() => {
    return createPublicClient({
      chain: fromChain,
      transport: http(alchemyUrls[fromChain.id]),
      batch: {
        multicall: {
          wait: 40,
        },
      },
    });
  }, [fromChain]);

  const toWalletClient = useMemo(
    () =>
      createWalletClient({
        account: address,
        chain: toChain,
        transport: http(alchemyUrls[toChain.id]),
      }),
    [address, toChain],
  );

  const toPublicClient = useMemo(() => {
    return createPublicClient({
      chain: toChain,
      transport: http(alchemyUrls[toChain.id]),
      batch: {
        multicall: {
          wait: 40,
        },
      },
    });
  }, [toChain]);

  const customClient: CustomClients = useMemo(
    () => ({
      from: {
        wallet: fromWalletClient?.extend(walletActionsL1()).extend(walletActionsL2()),
        public: fromPublicClient.extend(publicActionsL2()).extend(publicActionsL1()),
        contracts: getFromContracts(fromChain, toChain),
      },
      to: {
        wallet: toWalletClient.extend(walletActionsL1()).extend(walletActionsL2()),
        public: toPublicClient.extend(publicActionsL2()).extend(publicActionsL1()),
        contracts: getToContracts(fromChain, toChain),
      },
    }),
    [fromChain, fromPublicClient, fromWalletClient, toChain, toPublicClient, toWalletClient],
  );

  return (
    <CustomClientConext.Provider
      value={{
        customClient,
      }}
    >
      {children}
    </CustomClientConext.Provider>
  );
};
