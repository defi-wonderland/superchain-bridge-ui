import { Box, Stack, Typography, styled } from '@mui/material';
import Image from 'next/image';

import clockIcon from '~/assets/icons/clock.svg';
import gasIcon from '~/assets/icons/gas.svg';
import { useCustomTheme } from '~/hooks';

interface BridgeIconsProps {
  gas: string;
  time: string;
}
export const BridgeIcons = ({ gas, time }: BridgeIconsProps) => {
  return (
    <IconsContainer>
      <Stack gap='2rem' direction='row'>
        <Item>
          <Image src={gasIcon} alt='fees' />
          <Typography variant='body1'>{gas}</Typography>
        </Item>

        <Item>
          <Image src={clockIcon} alt='transaction time' />
          <Typography variant='body1'>{time}</Typography>
        </Item>
      </Stack>
    </IconsContainer>
  );
};

const IconsContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.7rem',
    p: {
      fontSize: '1.6rem',
      color: currentTheme.steel[300],
    },

    img: {
      height: '1.6rem',
      width: '1.6rem',
    },
  };
});

const Item = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.4rem',
  };
});
