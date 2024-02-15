import { createTheme } from '@mui/material';
import { Theme, ThemeName } from '~/types';

export const getMuiThemeConfig = (currentTheme: Theme, themeName: ThemeName) => {
  return createTheme({
    palette: {
      mode: themeName,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            fontSize: '62.5%', // to enable rem units (1rem = 10px)
          },
          body: {
            background: currentTheme.backgroundPrimary,
            color: currentTheme.textPrimary,
            // other global styles...
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          },
        },
      },
    },
    typography: {
      fontSize: 22.5,
      fontWeightRegular: 500,
      // set your global font family here
      fontFamily: [
        'GeneralSans-Variable',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      body1: {
        fontSize: '1.2rem',
      },
      // Modal title
      h2: {
        fontSize: '2rem',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '150%',
      },
      h3: {
        fontSize: '1.6rem',
        lineHeight: '150%',
      },
    },
  });
};
