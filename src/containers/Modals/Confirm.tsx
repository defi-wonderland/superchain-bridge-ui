import { Box, styled } from '@mui/material';

import BaseModal from '~/components/BaseModal';
import { useCustomTheme } from '~/hooks';
import { ModalType } from '~/types';

export const ConfirmModal = () => {
  return (
    <BaseModal type={ModalType.CONFIRM}>
      <ModalBody>
        <h1>Confirm modal</h1>
      </ModalBody>
    </BaseModal>
  );
};

const ModalBody = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    background: currentTheme.backgroundSecondary,
    height: '30rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };
});
