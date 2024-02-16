import { Box, styled } from '@mui/material';

import BaseModal from '~/components/BaseModal';
import { ModalType } from '~/types';

export const LoadingModal = () => {
  return (
    <BaseModal type={ModalType.LOADING} title='Transaction pending'>
      <ModalBody>
        <h1>Loading...</h1>
      </ModalBody>
      You can safely close this modal
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
