import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { useCustomTheme } from '~/hooks';

export const ThemeButton = () => {
  const { theme, changeTheme } = useCustomTheme();

  return <IconButton onClick={changeTheme}>{theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>;
};
