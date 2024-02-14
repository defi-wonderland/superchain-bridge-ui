import { Badge, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';

import { Connect } from '~/components';
import { useChain, useCustomTheme, useModal } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';
import { ModalType } from '~/types';
import logo from '~/assets/logo.svg';
import historyIcon from '~/assets/icons/clock-rewind.svg';
import settingsIcon from '~/assets/icons/settings.svg';

export const Header = () => {
  const { fromChain } = useChain();
  const { setModalOpen } = useModal();
  const chainPath = replaceSpacesWithHyphens(fromChain?.name || '');

  const openSettings = () => {
    setModalOpen(ModalType.SETTINGS);
  };

  return (
    <HeaderContainer>
      {/* Left section */}
      <LeftSection>
        <Link href='/' replace>
          <Image src={logo} alt='Superchain Bridge' />
        </Link>
      </LeftSection>

      {/* Right section */}
      <RightSection>
        <IconButton>
          <Badge badgeContent={4} variant='dot' color='primary' overlap='circular'>
            <Link
              href={{
                pathname: '/[chain]/history',
                query: { chain: chainPath },
              }}
              replace
            >
              <SHistoryIcon src={historyIcon} alt='Transaction History' />
            </Link>
          </Badge>
        </IconButton>

        <IconButton onClick={openSettings}>
          <StyledSettingsIcon src={settingsIcon} alt='Settings' />
        </IconButton>

        <Connect />

        {/* <LangButton /> */}

        {/* <ThemeButton /> */}
      </RightSection>
    </HeaderContainer>
  );
};

const HeaderContainer = styled('header')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    height: '8rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 100,
    h1: {
      color: currentTheme.titleColor,
    },
    svg: {
      fontSize: '2.8rem',
    },
  };
});

const RightSection = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.4rem',

    button: {
      padding: '1rem',
    },

    a: {
      display: 'flex',
      alignItems: 'center',
    },

    '.MuiBadge-badge.MuiBadge-dot': {
      backgroundColor: currentTheme.errorPrimary,
    },
  };
});

const LeftSection = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '5rem',
});

const SHistoryIcon = styled(Image)({
  height: '2.4rem',
  width: '2.4rem',
});

const StyledSettingsIcon = styled(Image)({
  height: '2.4rem',
  width: '2.4rem',
});
