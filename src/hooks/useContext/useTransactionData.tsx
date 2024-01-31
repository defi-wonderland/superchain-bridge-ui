import { useContext } from 'react';
import { TransactionDataContext } from '~/providers/TransactionDataProvider';

export const useTransactionData = () => {
  const context = useContext(TransactionDataContext);

  if (context === undefined) {
    throw new Error('useTransactionData must be used within a StateProvider');
  }

  return context;
};
