import { createContext, useCallback, useMemo, useState } from 'react';
import { Chain } from 'viem';
import { useConfig } from 'wagmi';

type ContextType = {
  availableChains: readonly Chain[];

  fromChain: Chain;
  setFromChain: (val: Chain) => void;
  toChain: Chain;
  setToChain: (val: Chain) => void;

  fromList: Chain[];
  toList: Chain[];

  l1Chains: Chain[];
  l2Chains: Chain[];

  switchChains: () => void;
  resetChains: () => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const ChainContext = createContext({} as ContextType);

export const ChainProvider = ({ children }: StateProps) => {
  const config = useConfig();

  const availableChains = useMemo(() => config.chains, [config.chains]);
  const [fromChain, setFromChain] = useState<Chain>(availableChains[0] as Chain);
  const [toChain, setToChain] = useState<Chain>(availableChains[1] as Chain);

  const switchChains = useCallback(() => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  }, [fromChain, toChain]);

  const fromList = useMemo(
    () => availableChains.filter((chain) => chain.id !== toChain.id),
    [availableChains, toChain.id],
  );

  const toList = useMemo(
    () => availableChains.filter((chain) => chain.id !== fromChain.id),
    [availableChains, fromChain.id],
  );

  const resetChains = useCallback(() => {
    setFromChain(availableChains[0] as Chain);
    setToChain(availableChains[1] as Chain);
  }, [availableChains]);

  const l1Chains = useMemo(() => availableChains.filter((chain) => !chain.sourceId), [availableChains]);
  const l2Chains = useMemo(() => availableChains.filter((chain) => chain.sourceId), [availableChains]);

  return (
    <ChainContext.Provider
      value={{
        fromChain,
        setFromChain,
        toChain,
        setToChain,
        fromList,
        toList,
        availableChains,
        switchChains,
        resetChains,

        l1Chains,
        l2Chains,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
