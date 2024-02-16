import { styled } from '@mui/material';
import Image from 'next/image';

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

  const Icons = (
    <>
      <BridgeIcons gas='$7.21' time='2m' />
      <Image src={chevrownDown} alt='arrow-down' className='chevron-down' />
    </>
  );

  return (
    <MenuButton variant='contained' disableElevation onClick={openBridgeModal} endIcon={<>{Icons}</>} fullWidth>
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
    alignItems: 'center',
    img: {
      height: '1.6rem',
      width: '1.6rem',
      margin: 'auto 0',
    },

    '&:last-child': {
      '.chevron-down': {
        marginLeft: '1.7rem',
      },
    },
  };
});
