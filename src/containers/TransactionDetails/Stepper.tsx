import { styled } from '@mui/material';

import { getTxDetailsButtonText } from '~/utils';
import { DataContainer, LeftSection } from './TxDetails';
import { useLogs, useModal, useTransactionData } from '~/hooks';
import { ModalType, TransactionType } from '~/types';
import { PrimaryButton, Step } from '~/components';

export const Stepper = () => {
  const { setModalOpen } = useModal();
  const { selectedLog } = useLogs();
  const { setTransactionType, userAddress } = useTransactionData();
  const transactionType = selectedLog?.type;
  const isActionRequired = selectedLog?.status === 'ready-to-prove' || selectedLog?.status === 'ready-to-finalize';

  const handleReview = () => {
    const statusToTransactionTypeMap: { [k: string]: TransactionType } = {
      'ready-to-prove': TransactionType.PROVE,
      'ready-to-finalize': TransactionType.FINALIZE,
      failed: TransactionType.REPLAY,
    };

    setTransactionType(statusToTransactionTypeMap[selectedLog?.status || '']);
    setModalOpen(ModalType.REVIEW);
  };

  return (
    <RightSection>
      <SDataContainer>
        {(transactionType === 'Deposit' || transactionType === 'Force Tx') && (
          <>
            <Step text='Initiate Transaction' hash={selectedLog?.transactionHash || ''} status='success' />
            <Step text='Finalized Transaction' hash={selectedLog?.l2TransactionHash} status='final' />
          </>
        )}

        {transactionType === 'Withdrawal' && (
          <>
            {selectedLog?.status === 'ready-to-prove' && (
              <>
                <Step text='Initiate Transaction' hash={selectedLog?.transactionHash || ''} status='success' />
                <Step text='Prove Withdrawal' status='pending' />
                <Step text='Finalize Withdrawal' status='idle' />
              </>
            )}
            {selectedLog?.status === 'ready-to-finalize' && (
              <>
                <Step text='Initiate Transaction' hash={selectedLog?.transactionHash || ''} status='success' />
                <Step text='Prove Withdrawal' status='success' />
                <Step text='Finalize Withdrawal' status='pending' connector={false} />
              </>
            )}
            {selectedLog?.status === 'finalized' && (
              <>
                <Step text='Initiate Transaction' hash={selectedLog?.transactionHash || ''} status='success' />
                <Step text='Prove Withdrawal' status='success' />
                <Step text='Finalize Withdrawal' status='final' />
              </>
            )}
          </>
        )}

        {isActionRequired && (
          <PrimaryButton onClick={handleReview} disabled={!userAddress}>
            {getTxDetailsButtonText(selectedLog?.status || '')}
          </PrimaryButton>
        )}
      </SDataContainer>
    </RightSection>
  );
};

const SDataContainer = styled(DataContainer)(() => {
  return {
    gap: '0',
  };
});

const RightSection = styled(LeftSection)({});
