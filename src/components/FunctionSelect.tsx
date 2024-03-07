import { useState } from 'react';
import { styled, MenuProps, MenuItem, Menu, Box } from '@mui/material';
import Image from 'next/image';
import { AbiFunction } from 'viem';

import chevrownDown from '~/assets/icons/chevron-down.svg';
import { useCustomTheme } from '~/hooks';
import { BasicButton } from './Buttons';

interface FunctionSelectProps {
  value: AbiFunction | undefined;
  setValue: (functionMethod?: AbiFunction) => void;
  list: AbiFunction[];
  disabled?: boolean;
}

export const FunctionSelect = ({ list, value, setValue, disabled }: FunctionSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const selectItem = (functionName?: string) => {
    setAnchorEl(null);

    if (!functionName) return;
    const functionMethod = list.find((item: AbiFunction) => item.name === functionName);

    setValue(functionMethod);
  };

  const endIcon = disabled ? null : <Image src={chevrownDown} alt='arrow-down' width={16} height={16} />;

  return (
    <SBox>
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
        {value?.name || 'Enter a valid ABI to see available functions'}
      </MenuButton>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => selectItem()}
        MenuListProps={{
          'aria-labelledby': 'basic-select-button',
        }}
      >
        <Box className='list-container'>
          {list.map((functionMethod, index) => (
            <MenuItem
              key={functionMethod.name + index}
              value={functionMethod.name}
              onClick={() => selectItem(functionMethod.name)}
            >
              {functionMethod.name}
            </MenuItem>
          ))}
        </Box>
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
    position: 'relative',
  };
});

const MenuButton = styled(BasicButton)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    height: '4.9rem',
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
      color: currentTheme.steel[400],
      border: 'none',
      opacity: 1,
    },
  };
});

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(() => {
  const { currentTheme } = useCustomTheme();
  return {
    minWidth: '100%',

    '& .MuiPaper-root': {
      minWidth: '46.4rem',
      padding: '0.6rem 0.8rem',
      borderRadius: '1.6rem',
      border: '1px solid',
      borderColor: currentTheme.steel[700],
      background: currentTheme.steel[900],
      color: currentTheme.steel[100],
      fontSize: '1.6rem',
      marginTop: '-0.4rem',

      '& .MuiMenu-list': {
        padding: '0.4rem 0',
      },

      '& .MuiMenuItem-root': {
        borderRadius: '0.8rem',
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

    '.list-container': {
      overflow: 'auto',
      maxHeight: '20rem',
      '&::-webkit-scrollbar': {
        width: '0.6rem',
        height: '0.6rem',
        background: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        background: currentTheme.steel[700],
        borderRadius: '0.4rem',
      },

      '&::-webkit-scrollbar-thumb:hover': {
        background: currentTheme.steel[600],
      },

      '&::-webkit-scrollbar-thumb:active': {
        background: currentTheme.steel[600],
      },
    },
  };
});
