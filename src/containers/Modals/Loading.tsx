import { Box, Typography, styled } from '@mui/material';

import { Step } from '~/components';
import BaseModal from '~/components/BaseModal';
import { useCustomTheme } from '~/hooks';
import { ModalType } from '~/types';

export const LoadingModal = () => {
  return (
    <BaseModal type={ModalType.LOADING} title='Transaction pending'>
      <SBox>
        {/* Temporary fixed values */}
        <Step text='Initiate Transaction' status='success' />
        <Step text='Bridging assets' status='pending' />
        <Step text='Transaction Complete' status='idle' />

        <STypography variant='body1'> You can safely close this modal</STypography>
      </SBox>
    </BaseModal>
  );
};

const SBox = styled(Box)(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
});

const STypography = styled(Typography)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'block',
    color: currentTheme.steel[500],
    fontSize: '1.4rem',
    fontWeight: 400,
  };
});
