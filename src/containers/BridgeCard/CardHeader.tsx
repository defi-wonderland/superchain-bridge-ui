import { Box, IconButton, styled, Typography } from '@mui/material';
import Image from 'next/image';

import adjustmentsIcon from '~/assets/icons/adjustments.svg';
import adjustmentsActivated from '~/assets/icons/adjustments-horizontal.svg';
import arrowLeft from '~/assets/icons/arrow-left.svg';

import { useCustomTheme } from '~/hooks';
import { CustomTransactionType } from '~/types';

interface CardHeaderProps {
  isExpertMode: boolean;
  setIsExpertMode: (isExpertMode: boolean) => void;
  customTransaction: boolean;
  setCustomTransaction: (customTransaction?: CustomTransactionType) => void;
}

export const CardHeader = ({
  isExpertMode,
  customTransaction,
  setIsExpertMode,
  setCustomTransaction,
}: CardHeaderProps) => {
  return (
    <Header>
      {!customTransaction && (
        <>
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
        </>
      )}

      {customTransaction && (
        <Box>
          <IconButton onClick={() => setCustomTransaction(undefined)}>
            <Image src={arrowLeft} alt='back' className={isExpertMode ? 'advance-activated' : ''} />
          </IconButton>
          <Typography variant='h1'>Custom transaction</Typography>
        </Box>
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
