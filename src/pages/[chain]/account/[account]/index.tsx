import { useCallback, useEffect, useMemo } from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import arrowLeft from '~/assets/icons/arrow-left.svg';
import copyIcon from '~/assets/icons/copy.svg';

import { MainCardContainer, ActivityTable } from '~/containers';
import { createData, formatDataNumber, getTimestamps } from '~/utils';
import { useCustomClient, useCustomTheme, useLogs, useTokenList } from '~/hooks';
import { CustomHead, TableSkeleton } from '~/components';

const History = () => {
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { customClient } = useCustomClient();
  const { fromTokens, toTokens } = useTokenList();
  const { depositLogs, withdrawLogs, orderedLogs, isSuccess, setOrderedLogs, isLoading, setIsLoading } = useLogs();

  const getOrderedLogs = useCallback(async () => {
    if (!depositLogs || !withdrawLogs) return;
    const accountLogs = [...depositLogs.accountLogs, ...withdrawLogs.accountLogs];
    const blocks = await getTimestamps(accountLogs, customClient);

    const logsWithTimestamp = accountLogs.map((log, index) => {
      return { ...log, timestamp: blocks[index].timestamp };
    });
    const orderedLogs = logsWithTimestamp.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    const reversedLogs = orderedLogs.reverse(); // latest logs first
    setOrderedLogs(reversedLogs);
    setIsLoading(false);
  }, [customClient, depositLogs, setIsLoading, setOrderedLogs, withdrawLogs]);

  const rows = useMemo(() => {
    const data = orderedLogs.map((eventLog) => {
      const token =
        fromTokens.find((token) => token.address === eventLog.localToken) ||
        toTokens.find((token) => token.address === eventLog.localToken);

      return createData(
        eventLog.type,
        eventLog?.amount ? `${formatDataNumber(Number(eventLog.amount), token?.decimals, 2)} ${token?.symbol}` : '-', // amount
        eventLog.transactionHash,
        eventLog.timestamp.toString(),
        eventLog.status,
        eventLog,
      );
    });

    return data;
  }, [fromTokens, orderedLogs, toTokens]);

  const handleBack = () => {
    router.push('/');
  };

  useEffect(() => {
    if (orderedLogs.length === 0 && isSuccess) {
      getOrderedLogs();
    }
  }, [getOrderedLogs, orderedLogs.length, isSuccess]);

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
            {currentAddress && <Typography variant='body1'>{currentAddress}</Typography>}
            <Image src={copyIcon} alt='Copy to clipboard' />
          </Box>
        </HeaderContainer>

        {!isLoading && <ActivityTable rows={rows} />}
        {isLoading && <TableSkeleton />}
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
