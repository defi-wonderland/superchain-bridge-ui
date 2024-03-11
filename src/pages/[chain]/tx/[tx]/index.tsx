import { useEffect } from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Image from 'next/image';

import arrowLeft from '~/assets/icons/arrow-left.svg';

import { MainCardContainer, Stepper, TxDetails } from '~/containers';
import { useCustomTheme, useLogs, useQueryParams } from '~/hooks';
import { CustomHead, StatusChip } from '~/components';
import { QueryParamKey } from '~/types';

const Transaction = () => {
  const { selectedLog } = useLogs();
  const { address } = useAccount();
  const { getParam } = useQueryParams();
  const chain = getParam(QueryParamKey.chain);
  const hash = getParam(QueryParamKey.tx);
  const router = useRouter();

  const handleBack = () => {
    router.push(address ? `/${chain}/account/${address}` : '/');
  };

  useEffect(() => {
    if (selectedLog?.transactionHash !== hash) {
      router.push('/');
    }
  }, [hash, router, selectedLog?.transactionHash]);

  return (
    <>
      <CustomHead title='Transaction Details' />

      {selectedLog && (
        <Container>
          <SMainCardContainer>
            <HeaderContainer>
              <Box>
                <IconButton onClick={handleBack}>
                  <Image src={arrowLeft} alt='back' />
                </IconButton>
                <Typography variant='h1'>{selectedLog?.type}</Typography>
                <StatusChip status={selectedLog?.status || ''} title />
              </Box>
            </HeaderContainer>

            <Content>
              {/* Left section */}
              <TxDetails />

              {/* Right section */}
              <Stepper />
            </Content>
          </SMainCardContainer>
        </Container>
      )}
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
    padding: '2rem 3.2rem 3.2rem 3.2rem',
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

    img: {
      width: '2rem',
      height: '2rem',
    },
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

    'div:first-of-type': {
      cursor: 'default',
      gap: '1.2rem',
    },

    p: {
      color: currentTheme.steel[400],
      fontSize: '1.6rem',
      fontWeight: 400,
      lineHeight: '1.8rem',
    },
  };
});

const Content = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start',
    width: '100%',
    gap: '3.2rem',
  };
});
