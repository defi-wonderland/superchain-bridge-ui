import { createContext, useMemo, useState } from 'react';
import { useChain } from '~/hooks';
import { TransactionType } from '~/types';

type ContextType = {
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
      }}
    >
      {children}
    </TransactionDataContext.Provider>
  );
};
