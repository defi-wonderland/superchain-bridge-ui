import { useState } from 'react';

import { Box, IconButton, styled, Typography, Menu, Switch, MenuProps } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    handleMenuClose();
  };

  const handleBack = () => {
    setCustomTransaction(undefined);
    resetChains();
    resetValues();
    resetTokenValues();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Header>
      {!customTransaction && (
        <>
          <Box className='primary-title'>
            <Typography variant='h1'>Superchain Bridge</Typography>
            {isExpertMode && <strong>Expert mode</strong>}
          </Box>
          <STooltip title={tooltipTitle}>
            <IconButton onClick={handleMenuOpen}>
              <Image
                src={isExpertMode ? adjustmentsActivated : adjustmentsIcon}
                alt='Advance mode'
                className={isExpertMode ? 'advance-activated' : ''}
              />
            </IconButton>
          </STooltip>
          <StyledMenu id='expert-mode-menu' anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <Box className='menu-item'>
              <span>Expert mode</span>
              <ExpertModeSwitch checked={isExpertMode} onChange={activateExpertMode} disableRipple />
            </Box>
          </StyledMenu>
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

    '@media (max-width: 600px)': {
      alignItems: 'flex-start',

      '.primary-title': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.4rem',
      },

      h1: {
        fontSize: '2rem',
      },
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

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(() => {
  const { currentTheme } = useCustomTheme();
  return {
    '& .MuiPaper-root': {
      borderRadius: '1.6rem',
      border: '1px solid',
      borderColor: currentTheme.steel[700],
      background: currentTheme.steel[900],
      color: currentTheme.steel[100],
      fontSize: '1.6rem',
      minWidth: '208px',
      minHeight: '72px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      '.menu-item': {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-2xl, 1.25rem)',
        alignSelf: 'stretch',
      },
      '@media (max-width: 600px)': {
        minWidth: '13rem',
        minHeigth: '4.5rem',
        '& .MuiPaper-root': {
          fontSize: '1rem',
          lineHeight: '1.5rem',
        },
      },
    },
  };
});

const ExpertModeSwitch = styled(Switch)(() => {
  return {
    width: 42,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 2,
      margin: '0 5%',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        '& + .MuiSwitch-track': {
          backgroundColor: '#7365C7',
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: '#fff',
        },
      },
      '&.Mui-checked + .MuiSwitch-track': {
        opacity: '1',
      },
    },
    '& .MuiSwitch-thumb': {
      width: 20,
      height: 20,
      boxShadow: 'none',
    },
    '& .MuiSwitch-track': {
      borderRadius: 13,
      backgroundColor: '#292B2E',
      opacity: 1,
      boxSizing: 'border-box',
    },
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 22,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(16px)',
      },
    },
  };
});
