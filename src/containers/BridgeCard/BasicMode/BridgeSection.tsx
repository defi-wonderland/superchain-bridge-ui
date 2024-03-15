import { Box, Typography, styled } from '@mui/material';
import Image from 'next/image';

import optimismLogo from '~/assets/chains/optimism.svg';
import chevrownDown from '~/assets/icons/chevron-down.svg';

import { BridgeIcons } from '~/components/BridgeIcons';
import { BasicButton } from '~/components/Buttons';
import { useModal } from '~/hooks';
import { ModalType } from '~/types';

export const BridgeSection = () => {
  const { setModalOpen } = useModal();

  const openBridgeModal = () => {
    setModalOpen(ModalType.SELECT_BRIDGE);
  };

  return (
    <MenuButton
      variant='contained'
      disableElevation
      onClick={openBridgeModal}
      endIcon={<Image src={chevrownDown} alt='arrow-down' className='chevron-down' />}
      fullWidth
    >
      <Box className='bridge-name'>
        <Box>
          <Image src={optimismLogo} alt='' className='bridge-image' />
          <Typography>Optimism Gateway</Typography>
        </Box>
        <BridgeIcons gas='$7.21' time='2m' />
      </Box>
    </MenuButton>
  );
};

const MenuButton = styled(BasicButton)(() => {
  return {
    padding: '1.2rem 1.6rem',
    height: '5.6rem',
    justifyContent: 'space-between',
    alignItems: 'center',

    img: {
      height: '1.6rem',
      width: '1.6rem',
      margin: 'auto 0',
    },

    p: {
      fontSize: '1.6rem',
    },

    '.bridge-name': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',

      div: {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.8rem',
      },

      'div:last-of-type': {
        marginLeft: 'auto',
      },

      img: {
        height: '2.4rem',
        width: '2.4rem',
      },
    },

    '.chevron-down': {
      marginLeft: '1.7rem',
    },

    '@media (max-width: 600px)': {
      height: '100%',
      '.bridge-name': {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'start',
        gap: '0.8rem',

        'div:last-of-type': {
          display: 'flex',
          flexDirection: 'row',
          gap: '0.8rem',
          margin: '0',
        },

        img: {
          height: '1.6rem',
          width: '1.6rem',
        },
      },
    },
  };
});
