import { Box, styled } from '@mui/material';
import { useEffect } from 'react';

import BaseModal from '~/components/BaseModal';
import { useModal } from '~/hooks';
import { ModalType } from '~/types';

export const LoadingModal = () => {
  const { modalOpen, setModalOpen } = useModal();

  useEffect(() => {
    setTimeout(() => {
      modalOpen === ModalType.LOADING && setModalOpen(ModalType.SUCCESS);
    }, 2000);
  }, [modalOpen, setModalOpen]);

  return (
    <BaseModal type={ModalType.LOADING}>
      <ModalBody>
        <h1>Loading...</h1>
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
