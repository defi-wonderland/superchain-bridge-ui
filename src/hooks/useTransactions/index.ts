import { useAccount, useSwitchChain } from 'wagmi';
import { useRouter } from 'next/router';
import { BaseError } from 'viem';

import { useChain, useLogs, useModal, useToken, useTransactionData } from '~/hooks';
import { ModalType, TransactionStep, TransactionType } from '~/types';
import { useWithdraw } from './useWithdraw';
import { useDeposit } from './useDeposit';

export const useTransactions = () => {
  const { transactionType, setErrorMessage, resetValues: resetTransactionData, setTxMetadata } = useTransactionData();
  const { resetValues: resetTokenValues } = useToken();
  const { switchChainAsync } = useSwitchChain();
  const { fromChain } = useChain();
  const { refetchLogs } = useLogs();
  const { chainId } = useAccount();
  const router = useRouter();

  const { setModalOpen } = useModal();

  const deposit = useDeposit();
  const { withdraw, prove, finalize } = useWithdraw();

  const executeTransaction = async () => {
    setModalOpen(ModalType.LOADING);
    setTxMetadata((prev) => ({ ...prev, step: TransactionStep.INITIATE }));

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

        case TransactionType.PROVE:
          await prove();
          break;

        case TransactionType.FINALIZE:
          await finalize();
          break;

        case TransactionType.SWAP:
          // TODO: Implement swap <- use Lifi
          break;

        case TransactionType.REPLAY:
          // TODO: Implement replay
          break;

        case TransactionType.BRIDGE:
          // TODO: Implement bridge <- use Lifi
          break;
      }

      setTxMetadata((prev) => ({ ...prev, step: TransactionStep.FINALIZED }));
      resetTokenValues();
      resetTransactionData();
      refetchLogs();

      setTimeout(() => {
        // redirect to history page if a tx hash is present in the URL
        if (router.query.tx) router.push(`/${router.query.chain}/account/${router.query.tx}`);

        setModalOpen(ModalType.SUCCESS);
        setTxMetadata({ step: TransactionStep.NONE });
      }, 3000);
    } catch (e) {
      const error = e as BaseError;

      setTxMetadata({ step: TransactionStep.NONE });
      setErrorMessage(error.shortMessage);
      setModalOpen(ModalType.ERROR);
    }
  };

  return { executeTransaction };
};
