import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { useChain, useTransactionData } from '~/hooks';
import { TransactionType } from '~/types';
import { useWithdraw } from './useWithdraw';
import { useDeposit } from './useDeposit';

export const useTransactions = () => {
  const { transactionType } = useTransactionData();
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { fromChain } = useChain();
  const chainId = useChainId();

  const deposit = useDeposit();
  const withdraw = useWithdraw();

  const executeTransaction = async () => {
    try {
      if (!userAddress) return;

      if (chainId !== fromChain.id) {
        await switchChainAsync({ chainId: fromChain.id });
      }

      switch (transactionType) {
        case TransactionType.DEPOSIT:
          deposit();
          break;
        case TransactionType.WITHDRAW:
          withdraw();
          break;
        case TransactionType.BRIDGE:
          // TODO: Implement bridge
          break;
      }
    } catch (e) {
      console.warn('Error: ', e);
    }
  };

  return executeTransaction;
};
