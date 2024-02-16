import { useState } from 'react';
import { Box, Button, IconButton, styled, Typography } from '@mui/material';
import { isHex } from 'viem';
import Image from 'next/image';

import adjustmentsIcon from '~/assets/icons/adjustments.svg';
import adjustmentsActivated from '~/assets/icons/adjustments-horizontal.svg';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';

import { ModalType } from '~/types';
import { BasicMode } from './BasicMode';
import { ExpertMode } from './ExpertMode';

export const BridgeCard = () => {
  const { setModalOpen } = useModal();
  const { amount, selectedToken } = useToken();
  const { mint, data } = useTransactionData();
  const [isExpertMode, setIsExpertMode] = useState(false);

  const handleReview = () => {
    setModalOpen(ModalType.REVIEW);
  };

  const isButtonDisabled =
    (selectedToken?.symbol === 'ETH' && !Number(mint)) ||
    (selectedToken && selectedToken?.symbol !== 'ETH' && !Number(amount)) ||
    (!!data && !isHex(data));

  return (
    <MainCardContainer>
      <Header>
        <Box>
          <Typography variant='h1'>Superchain Bridge</Typography>
          {isExpertMode && <strong>Expert mode</strong>}
        </Box>

        <StyledAdvanceButton onClick={() => setIsExpertMode(!isExpertMode)}>
          <Image
            src={isExpertMode ? adjustmentsActivated : adjustmentsIcon}
            alt='Advance mode'
            className={isExpertMode ? 'advance-activated' : ''}
          />
        </StyledAdvanceButton>
      </Header>

      {isExpertMode && <ExpertMode />}

      {!isExpertMode && <BasicMode />}

      <StyledButton variant='contained' fullWidth onClick={handleReview} disabled={isButtonDisabled}>
        {!isButtonDisabled && 'Review Transaction'}
        {isButtonDisabled && !isExpertMode && 'Enter amount'}
        {isButtonDisabled && isExpertMode && 'Select transaction type'}
      </StyledButton>
    </MainCardContainer>
  );
};

const MainCardContainer = styled('main')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.steel[900],
    boxShadow: currentTheme.mainCardBoxShadow,
    borderRadius: currentTheme.borderRadius,
    border: currentTheme.mainCardBorder,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    padding: '2rem 2.4rem 3.2rem 2.4rem',
    width: '51.2rem',
    gap: '2.4rem',
  };
});

const StyledButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.ghost[400],
    color: currentTheme.steel[900],
    border: 'none',
    padding: '1rem 1.8rem',
    borderRadius: '0.8rem',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '1.8rem',
    height: '6rem',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',

    '&:hover': {
      backgroundColor: currentTheme.ghost[500],
    },

    '&:disabled': {
      fontWeight: 500,
      backgroundColor: currentTheme.steel[700],
      borderColor: currentTheme.steel[700],
      color: currentTheme.steel[500],
    },
  };
});

const Header = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',

    h1: {
      color: currentTheme.steel[50],
      fontSize: '2.4rem',
      fontWeight: 500,
      lineHeight: '3.6rem',
    },

    div: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'start',
      gap: '1rem',
    },

    strong: {
      background: currentTheme.ghost[800],
      color: currentTheme.ghost[400],
      fontWeight: 500,
      borderRadius: '1.6rem',
      fontSize: '1.4rem',
      padding: '0.8rem',
      lineHeight: 1.2,
    },
  };
});

const StyledAdvanceButton = styled(IconButton)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    '&:has(.advance-activated)': {
      background: currentTheme.ghost[800],
    },
  };
});
