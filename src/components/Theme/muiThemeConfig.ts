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
          html: {},
          body: {
            fontSize: '62.5%', // to enable rem units (1rem = 10px)
            background: currentTheme.backgroundPrimary,
            color: currentTheme.textPrimary,
            // other global styles...
          },
        },
      },
    },
    typography: {
      // set your global font family here
      fontFamily: [
        'Inter',
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
    },
  });
};
