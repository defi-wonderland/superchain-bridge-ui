import { createContext, useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import { useChain } from '~/hooks';
import { TransactionType } from '~/types';

type ContextType = {
  userAddress?: Address;

  mint: string;
  setMint: (val: string) => void;

  value: string;
  setValue: (val: string) => void;

  data: string;
  setData: (val: string) => void;

  to: string;
  setTo: (val: string) => void;

  transactionType: TransactionType;
};

interface StateProps {
  children: React.ReactElement;
}

export const TransactionDataContext = createContext({} as ContextType);

export const TransactionDataProvider = ({ children }: StateProps) => {
  const { address } = useAccount();
  const [mint, setMint] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const { fromChain, toChain } = useChain();

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

  useEffect(() => {
    if (address) {
      // temporary
      setTo(address);
    }
  }, [address]);

  return (
    <TransactionDataContext.Provider
      value={{
        mint,
        setMint,
        value,
        setValue,
        data,
        setData,
        to,
        setTo,
        transactionType,
        userAddress: address,
      }}
    >
      {children}
    </TransactionDataContext.Provider>
  );
};
