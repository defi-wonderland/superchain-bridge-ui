import { useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import Image from 'next/image';

import chevrownDown from '~/assets/icons/chevron-down.svg';

// import { BridgeIcons } from '~/components/BridgeIcons';
import { BasicButton } from '~/components/Buttons';
import { useCustomTheme, useModal, useToken } from '~/hooks';
import { ModalType } from '~/types';
import { bridges } from '~/data';

export const BridgeSection = () => {
  const { setModalOpen } = useModal();
  const { selectedToken, bridgeData, setBridgeData, setAvailableBridges } = useToken();

  // TODO: add more bridges and remove this
  const disabled = true;

  const openBridgeModal = () => {
    setModalOpen(ModalType.SELECT_BRIDGE);
  };

  useEffect(() => {
    if (selectedToken) {
      const defaultBridge = selectedToken.cctp ? 'CCTP' : 'OP Standard Bridge';
      const newBridgeData = bridges.filter((bridge) => bridge.name === defaultBridge);

      setAvailableBridges(newBridgeData);
      setBridgeData(newBridgeData[0]);
    }
  }, [selectedToken, setAvailableBridges, setBridgeData]);

  return (
    <MenuButton
      variant='contained'
      disableElevation
      onClick={openBridgeModal}
      endIcon={disabled ? undefined : <Image src={chevrownDown} alt='arrow-down' className='chevron-down' />}
      fullWidth
      disabled={disabled}
    >
      <Box className='bridge-name'>
        <Box className='selected-bridge'>
          <Image src={bridgeData.logoUrl} alt='' className='bridge-image' width={24} height={24} />
          <Typography>{bridgeData.name}</Typography>
        </Box>
        {/* TODO: calculate gas */}
        {/* <BridgeIcons gas={bridgeData.fees} time={bridgeData.time} /> */}
      </Box>
    </MenuButton>
  );
};

const MenuButton = styled(BasicButton)(() => {
  const { currentTheme } = useCustomTheme();
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

      '.selected-bridge': {
        width: '100%',
      },

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

    '&:disabled': {
      backgroundColor: currentTheme.steel[800],
      color: currentTheme.steel[300],
      border: 'none',
    },

    '@media (max-width: 600px)': {
      height: '100%',
      '.bridge-name': {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'start',
        gap: '0.8rem',

        p: {
          fontSize: '1.4rem',
        },

        'div:last-of-type': {
          display: 'flex',
          flexDirection: 'row',
          gap: '0.8rem',
          margin: '0',
        },

        img: {
          height: '1.8rem',
          width: '1.8rem',
        },
      },
    },
  };
});
