import { styled, Box } from '@mui/material';

import { useCustomTheme } from '~/hooks';

export const CustomScrollbar = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    overflowY: 'auto',
    overflowX: 'hidden',

    ['&::-webkit-scrollbar']: {
      width: '0.6rem',
      height: ' 0.6rem',
      background: currentTheme.backgroundPrimary,
    },

    ['&::-webkit-scrollbar-thumb']: {
      background: currentTheme.textSecondary,
      borderRadius: '0.4rem',
    },

    [' &::-webkit-scrollbar-thumb:hover']: {
      background: currentTheme.textSecondary,
    },

    [' &::-webkit-scrollbar-thumb:active']: {
      background: currentTheme.textSecondary,
    },
  };
});
