import { createContext, useEffect, useMemo, useState } from 'react';

import { Theme, ThemeName } from '~/types';
import { getTheme } from '~/utils';

type ContextType = {
  theme: ThemeName;
  currentTheme: Theme;
  setTheme: (val: ThemeName) => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const ThemeContext = createContext({} as ContextType);

export const ThemeProvider = ({ children }: StateProps) => {
  const defaultTheme = 'dark';
  const themeKey = 'superchain-theme';

  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  const currentTheme = useMemo(() => getTheme(theme), [theme]);

  // Load theme from local storage on load
  useEffect(() => {
    const storedTheme = localStorage.getItem(themeKey) as ThemeName;
    if (!storedTheme) {
      localStorage.setItem(themeKey, defaultTheme);
    } else {
      setTheme(storedTheme);
    }
  }, [defaultTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
