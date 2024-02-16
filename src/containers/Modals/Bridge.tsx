import { Box, Button, Typography, styled } from '@mui/material';
// import Image from 'next/image';

import BaseModal from '~/components/BaseModal';
import { CustomScrollbar } from '~/components';
import { useCustomTheme, useModal } from '~/hooks';
import { ModalType } from '~/types';
import { BridgeIcons } from '~/components/BridgeIcons';
import { ListContainer } from './SelectToken';

export const BridgeModal = () => {
  const { closeModal } = useModal();

  return (
    <BaseModal type={ModalType.SELECT_BRIDGE} title='Select bridge'>
      {/* TODO: Input should be here */}

      <ListContainer>
        <CustomScrollbar>
          <Bridge onClick={closeModal} fullWidth>
            {/* Bridge logo and name */}
            <LeftSection>
              {/* <Image src={token.logoURI} alt={token.name} width={36} height={36} className='bridge-image' /> */}
              <Box>
                <Typography variant='h3'>Optimism Gateway</Typography>
              </Box>
            </LeftSection>

            {/* Bridge Info */}
            <BridgeIcons gas='$7.21' time='2m' />
          </Bridge>
        </CustomScrollbar>
      </ListContainer>
    </BaseModal>
  );
};

const Bridge = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.2rem',
    cursor: 'pointer',
    borderRadius: '1.2rem',
    textAlign: 'start',
    textTransform: 'none',

    '&:hover': {
      backgroundColor: currentTheme.steel[700],
    },

    h3: {
      color: currentTheme.steel[100],
    },

    p: {
      color: currentTheme.steel[500],
    },

    '.bridge-image': {
      width: '3.6rem',
      height: '3.6rem',
      borderRadius: '50%',
    },
  };
});

const LeftSection = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.2rem',
    div: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    },
  };
});
