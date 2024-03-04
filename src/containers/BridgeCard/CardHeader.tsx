import { Box, IconButton, styled, Typography } from '@mui/material';
import Image from 'next/image';

import adjustmentsIcon from '~/assets/icons/adjustments.svg';
import adjustmentsActivated from '~/assets/icons/adjustments-horizontal.svg';
import arrowLeft from '~/assets/icons/arrow-left.svg';

import { useChain, useCustomTheme, useToken, useTransactionData } from '~/hooks';
import { CustomTransactionType } from '~/types';
import { STooltip } from '~/components';

interface CardHeaderProps {
  isExpertMode: boolean;
  setIsExpertMode: (isExpertMode: boolean) => void;
  customTransaction?: CustomTransactionType;
  setCustomTransaction: (customTransaction?: CustomTransactionType) => void;
}

export const CardHeader = ({
  isExpertMode,
  customTransaction,
  setIsExpertMode,
  setCustomTransaction,
}: CardHeaderProps) => {
  const { resetChains } = useChain();
  const { resetValues } = useTransactionData();
  const { resetValues: resetTokenValues } = useToken();

  const tooltipTitle = isExpertMode ? 'Disable expert mode' : 'Enable expert mode';

  const cardTitle = (() => {
    if (customTransaction === 'custom-tx') return 'Custom transaction';
    if (customTransaction === 'force-withdrawal') return 'Force Withdrawal';
    if (customTransaction === 'force-transfer') return 'Force Transfer';
  })();

  const activateExpertMode = () => {
    setIsExpertMode(!isExpertMode);
    resetChains();
    resetValues();
    resetTokenValues();
  };

  const handleBack = () => {
    setCustomTransaction(undefined);
    resetChains();
    resetValues();
    resetTokenValues();
  };

  return (
    <Header>
      {!customTransaction && (
        <>
          <Box>
            <Typography variant='h1'>Superchain Bridge</Typography>
            {isExpertMode && <strong>Expert mode</strong>}
          </Box>

          <STooltip title={tooltipTitle}>
            <StyledAdvanceButton onClick={activateExpertMode}>
              <Image
                src={isExpertMode ? adjustmentsActivated : adjustmentsIcon}
                alt='Advance mode'
                className={isExpertMode ? 'advance-activated' : ''}
              />
            </StyledAdvanceButton>
          </STooltip>
        </>
      )}

      {customTransaction && (
        <SBox>
          <IconButton onClick={handleBack}>
            <Image src={arrowLeft} alt='back' />
          </IconButton>
          <Typography variant='h1'>{cardTitle}</Typography>
        </SBox>
      )}
    </Header>
  );
};

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

export const SBox = styled(Box)(() => {
  return {
    h1: {
      fontSize: '2rem',
    },
  };
});
