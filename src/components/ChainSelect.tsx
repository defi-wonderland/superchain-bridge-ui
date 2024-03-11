import { useState } from 'react';
import { styled, MenuProps, MenuItem, Menu, Box } from '@mui/material';
import Image from 'next/image';
import { Chain } from 'viem';

import chevrownDown from '~/assets/icons/chevron-down.svg';
import { useCustomTheme } from '~/hooks';
import { BasicButton } from './Buttons';
import { SInputLabel } from './InputField';
import { chainData } from '~/utils';

interface ChainSelectProps {
  value: Chain;
  label?: string;
  setValue: (chain: Chain) => void;
  list: Chain[];
  disabled?: boolean;
  isExternal?: boolean;
}

export const ChainSelect = ({ label, list, value, setValue, disabled, isExternal }: ChainSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const selectChain = (chain: Chain) => {
    setAnchorEl(null);

    if (!chain?.name) return;
    setValue(chain);
  };

  const endIcon =
    disabled || list.length < 2 ? null : <Image src={chevrownDown} alt='arrow-down' width={16} height={16} />;

  return (
    <SBox className='chain-select'>
      {label && <SInputLabel>{label}</SInputLabel>}
      <MenuButton
        className={isExternal ? 'external' : ''}
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={handleClick}
        endIcon={endIcon}
        fullWidth
        disabled={disabled || list.length < 2}
      >
        <Image src={chainData[value.id].logo} alt={`${value.name} logo`} width={32} height={32} />
        {value.name}
      </MenuButton>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={selectChain}
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
      >
        {list.map((chain) => (
          <MenuItem key={chain.id} value={chain.name} onClick={() => selectChain(chain)}>
            <Image src={chainData[chain.id].logo} alt={`${chain.name} logo`} width={24} height={24} />

            {chain.name}
          </MenuItem>
        ))}
      </StyledMenu>
    </SBox>
  );
};

const SBox = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    width: '100%',

    '.external': {
      backgroundColor: 'transparent',
    },
  };
});

const MenuButton = styled(BasicButton)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    padding: '1.2rem 1.6rem',
    fontSize: '1.6rem',
    height: '5.6rem',
    justifyContent: 'start',
    gap: '0.8rem',
    '.MuiButton-endIcon': {
      marginLeft: 'auto',
    },

    '&:disabled': {
      backgroundColor: currentTheme.steel[800],
      color: currentTheme.steel[300],
      border: 'none',
      opacity: 1,
    },
  };
});

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
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
      minWidth: '20rem',
      marginTop: '0.4rem',

      '& .MuiMenu-list': {
        padding: '0.4rem 0',
      },

      '& .MuiMenuItem-root': {
        padding: '1.2rem 1.6rem',
        gap: '0.8rem',
        fontSize: '1.6rem',

        '&:hover': {
          backgroundColor: currentTheme.steel[800],
        },

        '&:active': {
          backgroundColor: currentTheme.steel[700],
        },
      },
    },
  };
});
