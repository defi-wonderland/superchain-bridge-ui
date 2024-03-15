import { useState } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import Image from 'next/image';

import BaseModal from '~/components/BaseModal';
import { CustomScrollbar, SearchInput, BridgeIcons } from '~/components';
import { useCustomTheme, useModal, useToken } from '~/hooks';
import { ListContainer } from './Token';
import { ModalType } from '~/types';

export const BridgeModal = () => {
  const { closeModal } = useModal();
  const { availableBridges } = useToken();
  const [searchValue, setSearchValue] = useState('');

  return (
    <BaseModal type={ModalType.SELECT_BRIDGE} title='Select bridge' fixedHeight>
      <SearchInput value={searchValue} setValue={setSearchValue} placeholder='Search name' />

      <ListContainer>
        <CustomScrollbar>
          {availableBridges.map((bridge) => (
            <Bridge key={bridge.name} onClick={closeModal} fullWidth>
              {/* Bridge logo and name */}
              <LeftSection>
                <Image src={bridge.logoUrl} alt='' className='bridge-image' width={24} height={24} />
                <Box>
                  <Typography variant='h3'>{bridge.name}</Typography>
                </Box>
              </LeftSection>

              {/* Bridge Info */}
              <BridgeIcons gas={bridge.fees} time={bridge.time} />
            </Bridge>
          ))}
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
      width: '2.4rem',
      height: '2.4rem',
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
