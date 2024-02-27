import { Box, IconButton, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import arrowLeft from '~/assets/icons/arrow-left.svg';
import copyIcon from '~/assets/icons/copy.svg';

import { MainCardContainer, ActivityTable } from '~/containers';
import { truncateAddress } from '~/utils';
import { CustomHead } from '~/components';
import { useCustomTheme } from '~/hooks';

const History = () => {
  const router = useRouter();
  const { address: currentAddress } = useAccount();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Container>
      <CustomHead title='Account History' />

      <SMainCardContainer>
        <HeaderContainer>
          <Box>
            <IconButton onClick={handleBack}>
              <Image src={arrowLeft} alt='back' />
            </IconButton>
            <Typography variant='h1'>Account History</Typography>
          </Box>

          <Box>
            {currentAddress && <Typography variant='body1'>{truncateAddress(currentAddress || '0x')}</Typography>}
            <Image src={copyIcon} alt='Copy to clipboard' />
          </Box>
        </HeaderContainer>

        <ActivityTable />
      </SMainCardContainer>
    </Container>
  );
};

export default History;

export const SMainCardContainer = styled(MainCardContainer)(() => {
  return {
    overflow: 'auto',
    width: '84.3rem',
    maxHeight: '68rem',
    boxShadow: 'none',
    padding: '2rem 3.2rem',
  };
});

const Container = styled(Box)(() => {
  return {
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  };
});

const HeaderContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();

  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    gap: '1.2rem',
    h1: {
      color: currentTheme.steel[50],
      fontSize: '3rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    div: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0.8rem',
      cursor: 'pointer',
    },
    p: {
      color: currentTheme.steel[300],
      fontSize: '1.6rem',
      fontWeight: 400,
      lineHeight: '1.8rem',
    },
  };
});
