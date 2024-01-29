import { Box, Button, styled } from '@mui/material';

import BaseModal from '~/components/BaseModal';
import { useModal, useCustomClient, useTokens } from '~/hooks';
import { ModalType } from '~/types';

export const ReviewModal = () => {
  const { setModalOpen } = useModal();
  const { transactionType } = useCustomClient();
  const { selectedToken } = useTokens();

  const handleReview = () => {
    setModalOpen(ModalType.LOADING);
  };

  return (
    <BaseModal type={ModalType.REVIEW}>
      <ModalBody>
        <h1>Review modal</h1>
        <p>Transaction: {transactionType}</p>
        <p>Token: {selectedToken?.symbol}</p>

        <Button variant='contained' color='primary' fullWidth onClick={handleReview}>
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
