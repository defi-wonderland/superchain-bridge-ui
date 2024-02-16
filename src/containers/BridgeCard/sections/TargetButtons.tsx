import { Button, Stack, styled } from '@mui/material';
import { parseUnits } from 'viem';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';
import { formatDataNumber, getUsdBalance } from '~/utils';
import { SInputLabel } from '~/components';
import { ModalType } from '~/types';

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const TargetButtons = () => {
  const { selectedToken, amount, price } = useToken();
  const { to, mint, value } = useTransactionData();
  const { setModalOpen } = useModal();

  const openSelectAccountModal = () => {
    setModalOpen(ModalType.SELECT_ACCOUNT);
  };
  const amountToShow = amount || value || mint;

  const formattedAmount = formatDataNumber(
    parseUnits(amountToShow, selectedToken?.decimals || 18).toString(),
    selectedToken?.decimals,
    2,
    false,
    true,
  );

  const usdValue = getUsdBalance(price, amountToShow, selectedToken?.decimals);

  return (
    <Stack direction='row' gap='0.8rem' width='100%'>
      <BasicButton fullWidth disabled>
        <SInputLabel>You receive</SInputLabel>

        {amountToShow && (
          <Stack direction='row' gap='0.8rem'>
            {formattedAmount} {selectedToken?.symbol}
            <span>({usdValue})</span>
          </Stack>
        )}
        {!amountToShow && '-'}
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

    '&:disabled': {
      color: currentTheme.steel[50],
    },
  };
});
