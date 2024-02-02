import { useChainId, useSwitchChain } from 'wagmi';

import { useChain, useModal, useTransactionData } from '~/hooks';
import { ModalType, TransactionType } from '~/types';
import { useWithdraw } from './useWithdraw';
import { useDeposit } from './useDeposit';

export const useTransactions = () => {
  const { transactionType } = useTransactionData();
  const { switchChainAsync } = useSwitchChain();
  const { fromChain } = useChain();
  const chainId = useChainId();

  const { setModalOpen } = useModal();

  const deposit = useDeposit();
  const withdraw = useWithdraw();

  const executeTransaction = async () => {
    setModalOpen(ModalType.LOADING);

    try {
      if (chainId !== fromChain.id) {
        await switchChainAsync({ chainId: fromChain.id });
      }

      switch (transactionType) {
        case TransactionType.DEPOSIT:
          await deposit();
          break;

        case TransactionType.WITHDRAW:
          await withdraw();
          break;

        case TransactionType.BRIDGE:
          // TODO: Implement bridge
          break;
      }

      setModalOpen(ModalType.SUCCESS);
    } catch (e) {
      console.warn(e);
      setModalOpen(ModalType.REVIEW);
    }
  };

  return { executeTransaction };
};
