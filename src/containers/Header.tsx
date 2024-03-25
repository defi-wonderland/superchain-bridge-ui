import { Badge, Box, IconButton, useMediaQuery } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import Link from 'next/link';

import logo from '~/assets/logo.svg';
import responsiveLogo from '~/assets/responsive-logo.svg';
import historyIcon from '~/assets/icons/clock-rewind.svg';
import settingsIcon from '~/assets/icons/settings.svg';

import { Connect, STooltip } from '~/components';
import { useChain, useCustomTheme, useLogs, useModal } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';
import { ModalType } from '~/types';

export const Header = () => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const { address } = useAccount();
  const { transactionPending } = useLogs();
  const { toChain } = useChain();
  const { setModalOpen } = useModal();
  const { openConnectModal } = useConnectModal();
  const chainPath = replaceSpacesWithHyphens(toChain?.name || '');

  const openSettings = () => {
    setModalOpen(ModalType.SETTINGS);
  };

  const handleAccountHistory = () => {
    if (!address) {
      openConnectModal?.();
    } else {
      router.push(`/${chainPath}/account/${address}`);
    }
  };

  return (
    <HeaderContainer>
      {/* Left section */}
      <LeftSection>
        <Link href='/' replace>
          {!isMobile && <Image src={logo} alt='Superchain Bridge' priority />}
          {isMobile && <Image src={responsiveLogo} alt='Superchain Bridge' priority />}
        </Link>
      </LeftSection>

      {/* Right section */}
      <RightSection>
        {!isMobile && (
          <>
            <STooltip title='Account History' placement='bottom'>
              <IconButton onClick={handleAccountHistory} role='link'>
                <Badge invisible={!transactionPending} variant='dot' color='primary' overlap='circular'>
                  <SHistoryIcon src={historyIcon} alt='Account History' />
                </Badge>
              </IconButton>
            </STooltip>

            <STooltip title='Settings' placement='bottom'>
              <IconButton onClick={openSettings}>
                <StyledSettingsIcon src={settingsIcon} alt='Settings' />
              </IconButton>
            </STooltip>
          </>
        )}

        <Connect />

        {isMobile && (
          <STooltip title='Settings' placement='bottom'>
            <IconButton onClick={openSettings}>
              <StyledSettingsIcon src={settingsIcon} alt='Settings' />
            </IconButton>
          </STooltip>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

const HeaderContainer = styled('header')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    height: '8rem',
    minHeight: '8rem',
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

    '@media (max-width: 600px)': {
      height: '7.2rem',
      minHeight: '7.2rem',
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
    gap: '0.8rem',

    '.MuiIconButton-root': {
      padding: '1rem',
    },

    a: {
      display: 'flex',
      alignItems: 'center',
    },

    '.MuiBadge-badge.MuiBadge-dot': {
      backgroundColor: currentTheme.errorPrimary,
    },

    'button:last-of-type': {
      marginLeft: '1.2rem',
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
