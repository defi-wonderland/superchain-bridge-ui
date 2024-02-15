import { Button, styled } from '@mui/material';
import { useCustomTheme } from '~/hooks';

export const BasicButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderColor: currentTheme.steel[700],
    backgroundColor: currentTheme.steel[800],
    borderRadius: '1.2rem',
    padding: '1.6rem',
    textTransform: 'none',
    color: currentTheme.steel[100],

    '&:hover': {
      backgroundColor: currentTheme.steel[700],
    },
  };
});
