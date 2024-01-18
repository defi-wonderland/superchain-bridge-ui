import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material';

import { useCustomTheme } from '~/hooks';
import { Connect } from '~/components';
import { THEME_KEY } from '~/utils';

export const Header = () => {
  const { setTheme, theme } = useCustomTheme();
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'pt' : 'en';
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const handleThemeChange = () => {
    if (theme === 'light') {
      localStorage.setItem(THEME_KEY, 'dark');
      setTheme('dark');
    } else {
      localStorage.setItem(THEME_KEY, 'light');
      setTheme('light');
    }
  };

  return (
    <HeaderContainer>
      <h1>Logo</h1>
      <ThemeButton onClick={handleThemeChange}>{theme === 'dark' ? '🌞' : '🌕'}</ThemeButton>
      <button onClick={handleChangeLanguage}>
        language:
        {currentLanguage}
      </button>
      <Connect />
    </HeaderContainer>
  );
};

const HeaderContainer = styled('div')`
  display: flex;
  height: 8rem;
  padding: 0 8rem;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  max-width: 100vw;
  z-index: 100;
`;

const ThemeButton = styled('button')`
  background-color: inherit;
  border: none;
  outline: none;
  font-size: 2.2rem;
  cursor: pointer;
`;
