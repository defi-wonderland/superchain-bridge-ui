import { Dispatch, SetStateAction, createContext, useEffect, useMemo, useState } from 'react';
import { Address, isAddress, isHex } from 'viem';
import { useAccount } from 'wagmi';

import { useModal, useToken } from '~/hooks';
import { CustomTransactionType, ModalType, TransactionMetadata, TransactionStep, TransactionType } from '~/types';

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
  setTransactionType: (val: TransactionType) => void;

  txMetadata: TransactionMetadata;
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;

  errorMessage?: string;
  setErrorMessage: (val: string) => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const TransactionDataContext = createContext({} as ContextType);

export const TransactionDataProvider = ({ children }: StateProps) => {
  const { modalOpen } = useModal();
  const { address } = useAccount();
  const [mint, setMint] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [to, setTo] = useState<string>(address?.toString() || '');
  const [errorMessage, setErrorMessage] = useState<string>();

  const { amount } = useToken();
  const [customTransactionType, setCustomTransactionType] = useState<CustomTransactionType>();
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.NONE);
  const [txMetadata, setTxMetadata] = useState<TransactionMetadata>({ step: TransactionStep.NONE });

  const isReady = useMemo(() => {
    return !!((mint || value || amount || isHex(data)) && isAddress(to));
  }, [mint, value, amount, data, to]);

  const resetValues = () => {
    setMint('');
    setValue('');
    setData('');
    setTo(address?.toString() || '');
  };

  useEffect(() => {
    if (address) {
      setTo(address);
    }
  }, [address]);

  useEffect(() => {
    if (modalOpen === ModalType.SUCCESS) {
      setCustomTransactionType(undefined);
    }
  }, [modalOpen]);

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
        setTransactionType,
        userAddress: address,
        customTransactionType,
        setCustomTransactionType,
        isReady,
        resetValues,
        txMetadata,
        setTxMetadata,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </TransactionDataContext.Provider>
  );
};
