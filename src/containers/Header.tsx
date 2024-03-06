import { Badge, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import Link from 'next/link';

import { Connect, STooltip } from '~/components';
import { useChain, useCustomTheme, useLogs, useModal } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';
import { ModalType } from '~/types';
import logo from '~/assets/logo.svg';
import historyIcon from '~/assets/icons/clock-rewind.svg';
import settingsIcon from '~/assets/icons/settings.svg';

export const Header = () => {
  const { address } = useAccount();
  const { transactionPending } = useLogs();
  const { toChain } = useChain();
  const { setModalOpen } = useModal();
  const chainPath = replaceSpacesWithHyphens(toChain?.name || '');

  const openSettings = () => {
    setModalOpen(ModalType.SETTINGS);
  };

  return (
    <HeaderContainer>
      {/* Left section */}
      <LeftSection>
        <Link href='/' replace>
          <Image src={logo} alt='Superchain Bridge' priority />
        </Link>
      </LeftSection>

      {/* Right section */}
      <RightSection>
        <STooltip title='Transaction History' placement='bottom'>
          <Link
            href={{
              pathname: '/[chain]/account/[account]',
              query: { chain: chainPath, account: address },
            }}
          >
            <IconButton>
              <Badge invisible={!transactionPending} variant='dot' color='primary' overlap='circular'>
                <SHistoryIcon src={historyIcon} alt='Transaction History' />
              </Badge>
            </IconButton>
          </Link>
        </STooltip>

        <STooltip title='Settings' placement='bottom'>
          <IconButton onClick={openSettings}>
            <StyledSettingsIcon src={settingsIcon} alt='Settings' />
          </IconButton>
        </STooltip>

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
