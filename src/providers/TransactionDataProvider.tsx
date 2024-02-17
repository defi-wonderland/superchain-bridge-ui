import { createContext, useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import { useChain, useToken } from '~/hooks';
import { CustomTransactionType, TransactionType } from '~/types';

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

  isReady: boolean;

  customTransactionType?: CustomTransactionType;
  setCustomTransactionType: (val?: CustomTransactionType) => void;

  resetValues: () => void;

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
  const [to, setTo] = useState<string>(address?.toString() || '');

  const { amount } = useToken();
  const { fromChain, toChain } = useChain();
  const [customTransactionType, setCustomTransactionType] = useState<CustomTransactionType>();

  // If the selected chain has a sourceId, its because it's a L2 chain
  const isFromAnL2 = !!fromChain?.sourceId;
  const isToAnL2 = !!toChain?.sourceId;

  const transactionType = useMemo(() => {
    // If both chains are L2, it's a bridge transaction
    if (isFromAnL2 && isToAnL2) {
      return TransactionType.BRIDGE;
      // If the source chain is L2 and the destination chain is L1, it's a withdraw transaction
    } else if (isFromAnL2 && !isToAnL2) {
      return TransactionType.WITHDRAW;
      // If the source chain is L1 and the destination chain is L2, it's a deposit transaction
    } else if (!isFromAnL2 && isToAnL2) {
      return TransactionType.DEPOSIT;
      // If both chains are L1, it's a swap transaction
    } else {
      return TransactionType.SWAP;
    }
  }, [isFromAnL2, isToAnL2]);

  const isReady = useMemo(() => {
    return !!(mint || value || amount || data);
  }, [mint, value, amount, data]);

  const resetValues = () => {
    setMint('');
    setValue('');
    setData('');
    setTo(address?.toString() || '');
  };

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
        customTransactionType,
        setCustomTransactionType,
        isReady,
        resetValues,
      }}
    >
      {children}
    </TransactionDataContext.Provider>
  );
};
