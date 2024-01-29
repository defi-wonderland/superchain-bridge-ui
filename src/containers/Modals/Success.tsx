import { Box, Button, styled } from '@mui/material';

import { BaseModal } from '~/components';
import { useModal } from '~/hooks';
import { ModalType } from '~/types';

export const SuccessModal = () => {
  const { setModalOpen } = useModal();

  const handleClose = () => {
    setModalOpen(ModalType.NONE);
  };

  return (
    <BaseModal type={ModalType.SUCCESS}>
      <ModalBody>
        <h1>Sucess!</h1>

        <Button variant='contained' color='primary' fullWidth onClick={handleClose}>
          Close
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
