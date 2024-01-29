import { Box, Button, styled } from '@mui/material';

import { BaseModal } from '~/components';
import { useModal } from '~/hooks';
import { ModalType } from '~/types';

export const ReviewModal = () => {
  const { setModalOpen } = useModal();

  const handleReview = () => {
    setModalOpen(ModalType.LOADING);
  };

  return (
    <BaseModal type={ModalType.REVIEW}>
      <ModalBody>
        <h1>Review modal</h1>

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
