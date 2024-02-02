import { Box, Button, styled } from '@mui/material';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useTransactions } from '~/hooks';

import { ModalType } from '~/types';

export const ReviewModal = () => {
  const { transactionType } = useTransactionData();
  const { selectedToken } = useToken();
  const executeTransaction = useTransactions();

  // temporary function, will be removed
  const handleConfirm = async () => {
    executeTransaction();
  };

  return (
    <BaseModal type={ModalType.REVIEW}>
      <ModalBody>
        <h1>Review modal</h1>
        <p>Transaction: {transactionType}</p>
        <p>Token: {selectedToken?.symbol}</p>

        <Button variant='contained' color='primary' fullWidth onClick={handleConfirm}>
          Initiate Transaction
        </Button>
      </ModalBody>
    </BaseModal>
  );
};

const ModalBody = styled(Box)(() => {
  return {
    height: '30rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };
});
