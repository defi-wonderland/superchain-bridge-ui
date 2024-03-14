import { styled } from '@mui/material';

import { getTxDetailsButtonText } from '~/utils';
import { DataContainer, LeftSection } from '../TxDetails';
import { useLogs, useModal, useTransactionData } from '~/hooks';
import { ModalType, TransactionType } from '~/types';
import { PrimaryButton } from '~/components';
import { DepositSteps } from './DepositSteps';
import { CCTPSteps } from './CCTPSteps';
import { WithdrawalSteps } from './WithdrawalSteps';

export const Stepper = () => {
  const { setModalOpen } = useModal();
  const { selectedLog } = useLogs();
  const { setTransactionType, userAddress } = useTransactionData();
  const transactionType = selectedLog?.type;
  const isActionRequired = selectedLog?.status === 'ready-to-prove' || selectedLog?.status === 'ready-to-finalize';

  const handleReview = () => {
    const statusToTransactionTypeMap: { [k: string]: TransactionType } = {
      'ready-to-prove': TransactionType.PROVE,
      'ready-to-finalize': selectedLog?.type === 'CCTP' ? TransactionType.FINALIZE_CCTP : TransactionType.FINALIZE,
      failed: TransactionType.REPLAY,
    };

    setTransactionType(statusToTransactionTypeMap[selectedLog?.status || '']);
    setModalOpen(ModalType.REVIEW);
  };

  return (
    <RightSection>
      <SDataContainer>
        {transactionType === 'CCTP' && <CCTPSteps />}
        {(transactionType === 'Deposit' || transactionType === 'Force Tx') && <DepositSteps />}
        {transactionType === 'Withdrawal' && <WithdrawalSteps />}

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
