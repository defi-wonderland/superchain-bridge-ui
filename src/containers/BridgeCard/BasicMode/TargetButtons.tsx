import { Button, Stack, styled } from '@mui/material';
import { parseUnits } from 'viem';
import Image from 'next/image';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';
import { formatDataNumber, getUsdBalance, truncateAddress } from '~/utils';
import { SInputLabel, STooltip } from '~/components';
import { ModalType } from '~/types';

export const TargetButtons = () => {
  const { selectedToken, amount, price } = useToken();
  const { to, mint, value, userAddress } = useTransactionData();
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

  const usdValue = getUsdBalance(price, amountToShow, selectedToken?.decimals, true);
  const tooltipTitle = userAddress === to ? 'This is your connected wallet' : 'This is not your connected wallet';

  return (
    <Stack direction='row' gap='0.8rem' width='100%'>
      <BasicButton fullWidth disabled>
        <SInputLabel>You receive</SInputLabel>

        <StyledStack direction='row' gap='0.8rem'>
          <Image src={selectedToken.logoURI} alt={selectedToken.name} className='token-image' width={24} height={24} />
          {formattedAmount} {selectedToken?.symbol}
          {amountToShow && <span className='usd-value'>({usdValue})</span>}
        </StyledStack>
      </BasicButton>

      <STooltip title={tooltipTitle}>
        <BasicButton fullWidth onClick={openSelectAccountModal} disabled={!userAddress}>
          <SInputLabel>To address</SInputLabel>
          <>{to ? truncateAddress(to) : '-'}</>
        </BasicButton>
      </STooltip>
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
    padding: '1.2rem 1.6rem',
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
      backgroundColor: currentTheme.steel[800],
      borderColor: currentTheme.steel[600],
    },

    '&:disabled': {
      color: currentTheme.steel[50],
    },
  };
});

const StyledStack = styled(Stack)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[100],
    '&:not(:has(.usd-value))': {
      color: currentTheme.steel[600],
    },

    img: {
      borderRadius: '100%',
    },
  };
});
