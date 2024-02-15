import { Button, Stack, styled } from '@mui/material';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';
import { SInputLabel } from '~/components';
import { ModalType } from '~/types';

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const TargetButtons = () => {
  const { selectedToken, amount } = useToken();
  const { to, mint, value } = useTransactionData();
  const { setModalOpen } = useModal();

  const openSelectAccountModal = () => {
    setModalOpen(ModalType.SELECT_ACCOUNT);
  };

  const isAmountToShow = amount || value || mint;

  return (
    <Stack direction='row' gap='0.8rem' width='100%'>
      <BasicButton fullWidth>
        <SInputLabel>You receive</SInputLabel>

        {isAmountToShow && (
          <Stack direction='row' gap='0.8rem'>
            {amount || value || mint} {selectedToken?.symbol}
            <span>($1.231,02)</span>
          </Stack>
        )}
        {!isAmountToShow && '-'}
      </BasicButton>

      <BasicButton fullWidth onClick={openSelectAccountModal}>
        <SInputLabel>To address</SInputLabel>
        {truncateAddress(to)}
      </BasicButton>
    </Stack>
  );
};

const BasicButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '0.8rem',
    alignItems: 'start',
    justifyContent: 'start',
    border: '1px solid',
    borderColor: currentTheme.steel[700],
    backgroundColor: currentTheme.steel[800],
    borderRadius: '1.2rem',
    padding: '1.2rem 1.4rem',
    textTransform: 'none',
    color: currentTheme.steel[50],

    label: {
      fontSize: '1.4rem',
      cursor: 'pointer',
    },
    span: {
      color: currentTheme.steel[400],
      fontWeight: 400,
    },

    '&:hover': {
      backgroundColor: currentTheme.steel[700],
    },
  };
});
