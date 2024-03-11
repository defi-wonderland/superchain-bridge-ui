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
            {/* TODO: abstract and simplify this stepper */}
            <Step
              title='Initiate Transaction'
              hash={selectedLog?.transactionHash || ''}
              chainId={selectedLog?.originChain}
              status='success'
            />
            <Step
              title='Finalized Transaction'
              hash={selectedLog?.l2TransactionHash}
              chainId={selectedLog?.destinationChain}
              status='final'
            />
          </>
        )}

        {transactionType === 'Withdrawal' && (
          <>
            {selectedLog?.status === 'waiting-to-prove' && (
              <>
                <Step
                  title='Initiate Transaction'
                  hash={selectedLog?.transactionHash || ''}
                  chainId={selectedLog.originChain}
                  status='success'
                />
                <Step title='Wait to Prove' text='Wait up to 5 minutes' status='loading' />
                <Step title='Prove Withdrawal' status='idle' />
                <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='idle' />
                <Step title='Finalize Withdrawal' status='idle' connector={false} />
              </>
            )}
            {selectedLog?.status === 'ready-to-prove' && (
              <>
                <Step
                  title='Initiate Transaction'
                  hash={selectedLog?.transactionHash || ''}
                  chainId={selectedLog.originChain}
                  status='success'
                />
                <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
                <Step title='Prove Withdrawal' status='pending' />
                <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='idle' />
                <Step title='Finalize Withdrawal' status='idle' connector={false} />
              </>
            )}
            {selectedLog?.status === 'waiting-to-finalize' && (
              <>
                <Step
                  title='Initiate Transaction'
                  hash={selectedLog?.transactionHash || ''}
                  chainId={selectedLog.originChain}
                  status='success'
                />
                <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
                <Step title='Prove Withdrawal' status='success' />
                <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='loading' />
                <Step title='Finalize Withdrawal' status='idle' connector={false} />
              </>
            )}
            {selectedLog?.status === 'ready-to-finalize' && (
              <>
                <Step
                  title='Initiate Transaction'
                  hash={selectedLog?.transactionHash || ''}
                  chainId={selectedLog.originChain}
                  status='success'
                />
                <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
                <Step title='Prove Withdrawal' status='success' />
                <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='success' />
                <Step title='Finalize Withdrawal' status='pending' connector={false} />
              </>
            )}
            {selectedLog?.status === 'finalized' && (
              <>
                <Step
                  title='Initiate Transaction'
                  hash={selectedLog?.transactionHash || ''}
                  chainId={selectedLog.originChain}
                  status='success'
                />
                <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
                <Step title='Prove Withdrawal' status='success' />
                <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='success' />
                <Step title='Finalize Withdrawal' status='final' />
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
