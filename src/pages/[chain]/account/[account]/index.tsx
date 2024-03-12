import { useCallback, useEffect, useMemo } from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { Chain } from 'viem';

import arrowLeft from '~/assets/icons/arrow-left.svg';
import copyIcon from '~/assets/icons/copy.svg';
import copyCheckIcon from '~/assets/icons/copy-check.svg';

import { MainCardContainer, ActivityTable } from '~/containers';
import { createData, formatDataNumber, getTimestamps } from '~/utils';
import { useChain, useCopyToClipboard, useCustomClient, useCustomTheme, useLogs, useTokenList } from '~/hooks';
import { ChainSelect, CustomHead, STooltip, TableSkeleton } from '~/components';

const History = () => {
  const router = useRouter();
  const { refetchLogs } = useLogs();
  const { setToChain, toChain, l2Chains } = useChain();
  const { address: currentAddress } = useAccount();
  const [copiedText, copy] = useCopyToClipboard();
  const { customClient } = useCustomClient();
  const { fromTokens, toTokens } = useTokenList();
  const { depositLogs, withdrawLogs, orderedLogs, isSuccess, setOrderedLogs, isLoading, setIsLoading } = useLogs();

  const handleTo = (chain: Chain) => {
    setToChain(chain);
    setTimeout(refetchLogs);
  };

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
      const logAmount = formatDataNumber(Number(eventLog.amount), token?.decimals, 2);
      const parsedLogAmount = `${logAmount} ${token?.symbol}`;

      return createData(
        eventLog.type,
        eventLog?.amount ? parsedLogAmount : '-', // amount
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
            <Box>
              <IconButton onClick={handleBack}>
                <Image src={arrowLeft} alt='back' />
              </IconButton>
              <Typography variant='h1'>Account History</Typography>
            </Box>

            <ChainSelect value={toChain} setValue={handleTo} list={l2Chains} isExternal />
          </Box>

          <STooltip title={copiedText === currentAddress ? 'Copied!' : 'Copy to clipboard'} arrow>
            <Box className='account' onClick={() => copy(currentAddress?.toString() || '')}>
              {currentAddress && <Typography variant='body1'>{currentAddress}</Typography>}
              <Image
                src={copiedText === currentAddress ? copyCheckIcon : copyIcon}
                alt='Copy to clipboard'
                className='copy-to-clipboard'
              />
            </Box>
          </STooltip>
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
    width: '100%',
    cursor: 'default',
    '.copy-to-clipboard': {
      transition: currentTheme.transition,
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
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0.8rem',

      '&:hover': {
        img: {
          filter: 'brightness(1.2)',
        },
      },
    },
    p: {
      transition: currentTheme.transition,
      color: currentTheme.steel[300],
      fontSize: '1.6rem',
      fontWeight: 400,
      lineHeight: '1.8rem',

      '&:hover': {
        color: currentTheme.steel[200],
      },
    },

    '.account': {
      cursor: 'pointer',
      width: 'auto',
    },

    '& .chain-select': {
      maxWidth: '20rem',
    },
  };
});
