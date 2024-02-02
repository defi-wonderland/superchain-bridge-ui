import { Box, Button, styled } from '@mui/material';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useTransactions } from '~/hooks';

import { ModalType } from '~/types';

export const ReviewModal = () => {
  const { transactionType, data, mint } = useTransactionData();
  const { selectedToken, amount } = useToken();
  const { executeTransaction } = useTransactions();

  const handleConfirm = async () => {
    executeTransaction();
  };

  return (
    <BaseModal type={ModalType.REVIEW}>
      <ModalBody>
        <h1>Review modal</h1>
        <p>Transaction type: {transactionType}</p>

        {selectedToken && <p>Token: {selectedToken?.symbol}</p>}
        {!selectedToken && <p>Message: {data}</p>}

        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={handleConfirm}
          disabled={selectedToken && (!amount || !mint)}
        >
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
