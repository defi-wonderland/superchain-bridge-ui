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
      backgroundColor: currentTheme.steel[800],
      borderColor: currentTheme.steel[600],
    },

    '&:disabled': {
      fontWeight: 500,
      backgroundColor: currentTheme.steel[700],
      borderColor: currentTheme.steel[700],
      color: currentTheme.steel[500],
    },
  };
});

export const PrimaryButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.ghost[400],
    color: currentTheme.steel[900],
    border: 'none',
    padding: '1.2rem 2rem',
    borderRadius: '1.2rem',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '1.6rem',
    lineHeight: '2.4rem',
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

export const SecondaryButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.steel[900],
    border: '1px solid',
    borderColor: currentTheme.ghost[400],
    color: currentTheme.ghost[400],
    padding: '1.2rem 2rem',
    borderRadius: '0.8rem',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '1.6rem',
    lineHeight: '2.4rem',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',

    '&:hover': {
      backgroundColor: currentTheme.ghost[900],
      borderColor: currentTheme.ghost[300],
      color: currentTheme.ghost[300],
    },

    '&:disabled': {
      fontWeight: 500,
      backgroundColor: currentTheme.steel[900],
      border: '1px solid',
      borderColor: currentTheme.ghost[500],
      color: currentTheme.ghost[500],
    },
  };
});
