import { Box, Typography, styled } from '@mui/material';

import { BackButton } from '../history/BackButton';
import { MainCardContainer } from '~/containers';
import { CustomHead } from '~/components';
import { useCustomTheme } from '~/hooks';

const Transaction = () => {
  return (
    <>
      <CustomHead title='Transaction Details' />

      <Container>
        <BackButton />

        <SMainCardContainer>
          <HeaderContainer>
            <Typography variant='h1'>Deposit</Typography>
            <Box>
              {/* {currentAddress && <Typography variant='body1'>{truncateAddress(currentAddress || '0x')}</Typography>} */}
            </Box>
          </HeaderContainer>
        </SMainCardContainer>
      </Container>
    </>
  );
};

export default Transaction;

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
    p: {
      color: currentTheme.steel[300],
      fontSize: '1.6rem',
      fontWeight: 400,
      lineHeight: '1.8rem',
    },
  };
});
