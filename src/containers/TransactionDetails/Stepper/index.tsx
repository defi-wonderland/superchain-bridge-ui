import { styled } from '@mui/material';

import { getTxDetailsButtonText } from '~/utils';
import { DataContainer, LeftSection } from '../TxDetails';
import { useLogs, useModal, useTransactionData } from '~/hooks';
import { ModalType, TransactionType } from '~/types';
import { PrimaryButton } from '~/components';
import { DepositSteps } from './DepositSteps';
import { CCTPSteps } from './CCTPSteps';
import { WithdrawalSteps } from './WithdrawalSteps';
import { FailedSteps } from './FailedSteps';

export const Stepper = () => {
  const { setModalOpen } = useModal();
  const { selectedLog } = useLogs();
  const { setTransactionType, userAddress } = useTransactionData();
  const transactionType = selectedLog?.type;

  const isActionRequired =
    selectedLog?.status === 'ready-to-prove' ||
    selectedLog?.status === 'ready-to-finalize' ||
    selectedLog?.status === 'failed';

  const handleReview = () => {
    const statusToTransactionTypeMap: { [k: string]: TransactionType } = {
      'ready-to-prove': TransactionType.PROVE,
      'ready-to-finalize': selectedLog?.type === 'CCTP' ? TransactionType.FINALIZE_CCTP : TransactionType.FINALIZE,
      failed: TransactionType.REPLAY,
    };

    setTransactionType(statusToTransactionTypeMap[selectedLog?.status || '']);
    setModalOpen(ModalType.REVIEW);
  };

  const StepComponent = (() => {
    if (transactionType === 'CCTP') return <CCTPSteps />;
    if (transactionType === 'Deposit' && selectedLog?.status === 'failed') return <FailedSteps />;
    if (transactionType === 'Deposit' || transactionType === 'Force Tx') return <DepositSteps />;
    if (transactionType === 'Withdrawal') return <WithdrawalSteps />;
    return null;
  })();

  return (
    <RightSection>
      <SDataContainer>
        {StepComponent}

        {isActionRequired && (
          <PrimaryButton onClick={handleReview} disabled={!userAddress}>
            {getTxDetailsButtonText(selectedLog)}
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

const RightSection = styled(LeftSection)({
  '@media (max-width: 600px)': {
    width: '100%',
  },
});
