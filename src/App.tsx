import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './i18n';

import { Landing } from '~/pages';
import { ScrollToTop, useCustomTheme } from '~/hooks';
import { AppLayout } from '~/containers';
import { StateProvider } from './providers';
import { getMuiThemeConfig } from './components';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path='/' element={<Landing />} />
      </Route>
    </Routes>
  );
};

export const App = () => {
  const { theme: themeName, currentTheme } = useCustomTheme();
  const theme = useMemo(() => getMuiThemeConfig(currentTheme, themeName), [currentTheme, themeName]);

  return (
    <StateProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <ScrollToTop />
        <AppRouter />
      </MuiThemeProvider>
    </StateProvider>
  );
};
