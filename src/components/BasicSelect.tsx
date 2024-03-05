import { useState } from 'react';
import { styled, MenuProps, MenuItem, Menu, Box } from '@mui/material';
import Image from 'next/image';

import chevrownDown from '~/assets/icons/chevron-down.svg';
import { useCustomTheme } from '~/hooks';
import { BasicButton } from './Buttons';
import { SInputLabel } from './InputField';

interface BasicSelectProps {
  label: string;
  value: string;
  setValue: (explorer: string) => void;
  list: string[];
  disabled?: boolean;
}

export const BasicSelect = ({ label, list, value, setValue, disabled }: BasicSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const selectItem = (explorer?: string) => {
    setAnchorEl(null);

    if (!explorer) return;
    setValue(explorer);
  };

  const endIcon = disabled ? null : <Image src={chevrownDown} alt='arrow-down' width={16} height={16} />;

  return (
    <SBox>
      <SInputLabel>{label}</SInputLabel>
      <MenuButton
        aria-controls={open ? 'basic-select-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={handleClick}
        endIcon={endIcon}
        fullWidth
        disabled={disabled}
      >
        {value}
      </MenuButton>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => selectItem()}
        MenuListProps={{
          'aria-labelledby': 'basic-select-button',
        }}
      >
        {list.map((explorer) => (
          <MenuItem key={explorer} value={explorer} onClick={() => selectItem(explorer)}>
            {explorer}
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
  };
});

const MenuButton = styled(BasicButton)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    padding: '1rem 1.4rem',
    lineHeight: '2.4rem',
    fontSize: '1.6rem',
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
      minWidth: '39rem',
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
