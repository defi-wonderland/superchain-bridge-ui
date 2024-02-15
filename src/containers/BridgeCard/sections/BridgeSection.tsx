import { styled } from '@mui/material';
import Image from 'next/image';

import { BridgeIcons } from '~/components/BridgeIcons';
import { BasicButton } from '~/components/Buttons';
import chevrownDown from '~/assets/icons/chevron-down.svg';

export const BridgeSection = () => {
  const Icons = (
    <>
      <BridgeIcons gas='$7.21' time='2m' />
      <Image src={chevrownDown} alt='arrow-down' className='chevron-down' />
    </>
  );

  return (
    <MenuButton variant='contained' disableElevation onClick={() => null} endIcon={<>{Icons}</>} fullWidth>
      Optimism Gateway
    </MenuButton>
  );
};

const MenuButton = styled(BasicButton)(() => {
  return {
    padding: '1.2rem 1.6rem',
    fontSize: '1.6rem',
    height: '5.6rem',
    justifyContent: 'space-between',
    img: {
      height: '2.4rem',
      width: '2.4rem',
    },

    '&:last-child': {
      '.chevron-down': {
        marginLeft: '1.7rem',
      },
    },
  };
});
