import { Box, Typography, styled } from '@mui/material';
import Image from 'next/image';

import copyIcon from '~/assets/icons/copy.svg';

import { BackButton, DataRow, MainCardContainer } from '~/containers';
import { useCustomTheme, useQueryParams } from '~/hooks';
import { CustomHead } from '~/components';
import { QueryParamKey } from '~/types';

const Transaction = () => {
  const { getParam } = useQueryParams();
  const hash = getParam(QueryParamKey.tx);
  const chain = getParam(QueryParamKey.chain);

  return (
    <>
      <CustomHead title='Transaction Details' />

      <Container>
        <BackButton href={`/${chain}/history`} />

        <SMainCardContainer>
          <HeaderContainer>
            <Typography variant='h1'>Deposit</Typography>

            <Box>
              {hash && <Typography variant='body1'>{hash}</Typography>}
              <Image src={copyIcon} alt='Copy to clipboard' />
            </Box>
          </HeaderContainer>

          <Content>
            <LeftSection>
              <DataContainer>
                <DataRow>
                  <Typography variant='body1'>Date</Typography>
                  <span>2024-02-14 21:06</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Transaction type</Typography>
                  <span>Deposit</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Origin chain</Typography>
                  <span>Sepolia</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Destination chain</Typography>
                  <span>OP Sepolia</span>
                </DataRow>
              </DataContainer>

              <DataContainer>
                <DataRow>
                  <Typography variant='body1'>Bridge</Typography>
                  <span>Optimism Gateway</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Fees</Typography>
                  <span>$21.33</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Transaction time</Typography>
                  <span>2m</span>
                </DataRow>
              </DataContainer>

              <DataContainer>
                <DataRow>
                  <Typography variant='body1'>From</Typography>
                  <span>0x1111...cdef</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>To</Typography>
                  <span>0x1111...cdef</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Sent</Typography>
                  <span>2030 USDC</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Received</Typography>
                  <span>2030 USDC.e</span>
                </DataRow>
              </DataContainer>
            </LeftSection>

            <RightSection>
              <DataContainer>
                <DataRow>
                  <Typography variant='body1'>From</Typography>
                  <span>0x1111...cdef</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>To</Typography>
                  <span>0x1111...cdef</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Sent</Typography>
                  <span>2030 USDC</span>
                </DataRow>

                <DataRow>
                  <Typography variant='body1'>Received</Typography>
                  <span>2030 USDC.e</span>
                </DataRow>
              </DataContainer>
            </RightSection>
          </Content>
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

const LeftSection = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.6rem',
    width: '50%',
  };
});

const RightSection = styled(LeftSection)({});

const DataContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.steel[800],
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '1.2rem',
    gap: '1.2rem',
    padding: '1.6rem',
  };
});
