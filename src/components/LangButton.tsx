import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const LangButton = () => {
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <Button variant='contained' onClick={handleChangeLanguage}>
      {currentLanguage}
    </Button>
  );
};
