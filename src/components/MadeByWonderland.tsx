import Image from 'next/image';
import { Box, Typography, styled } from '@mui/material';

import { useCustomTheme } from '~/hooks';
import WonderlandLogo from '~/assets/wonderland.svg';

export const MadeByWonderland = () => {
  const handleClick = () => {
    window.open('https://defi.sucks/', '_blank');
  };

  return (
    <SBox onClick={handleClick}>
      <Typography variant='body1'>Made with 🤍 by</Typography>
      <Image src={WonderlandLogo} alt='Wonderland' />
    </SBox>
  );
};

const SBox = styled(Box)(() => {
  const { currentTheme, theme } = useCustomTheme();
  const logoFilter = theme === 'dark' ? 'none' : 'invert(1)';
  return {
    bottom: '3rem',
    left: '2rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    cursor: 'pointer',
    opacity: 0.5,
    p: {
      color: currentTheme.steel[25],
    },
    '&:hover': {
      opacity: 1,
      transition: currentTheme.transition,
    },
    img: {
      height: '1.2rem',
      width: '13rem',
      filter: logoFilter,
      marginTop: '-0.2rem',
    },
  };
});
