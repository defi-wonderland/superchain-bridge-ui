import { Badge, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import Link from 'next/link';
import { useChainId } from 'wagmi';

import { useCustomTheme } from '~/hooks';
import { Connect, LangButton, ThemeButton } from '~/components';

export const Header = () => {
  const chainId = useChainId();
  return (
    <HeaderContainer>
      {/* Left section */}
      <LeftSection>
        <Link href='/' replace>
          <h1>Superchain Bridge</h1>
        </Link>
      </LeftSection>

      {/* Right section */}
      <RightSection>
        <IconButton>
          <Link
            href={{
              pathname: '/[chain]/history',
              query: { chain: chainId },
            }}
            replace
          >
            <Badge badgeContent={4} variant='dot' color='primary'>
              <SHistoryIcon color='action' />
            </Badge>
          </Link>
        </IconButton>

        <Connect />

        <LangButton />

        <ThemeButton />

        <IconButton>
          <Link href='/settings' replace>
            <SettingsIcon color='action' />
          </Link>
        </IconButton>
      </RightSection>
    </HeaderContainer>
  );
};

const HeaderContainer = styled('nav')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    height: '6.4rem',
    padding: '0 8rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '100vw',
    zIndex: 100,
    borderBottom: `0.5px solid ${currentTheme.borderColor}`,
    h1: {
      color: currentTheme.titleColor,
    },
    svg: {
      fontSize: '2.8rem',
    },
  };
});

const RightSection = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.6rem',
});

const LeftSection = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '5rem',
});

const SHistoryIcon = styled(HistoryIcon)({
  fontSize: '3.2rem',
});
