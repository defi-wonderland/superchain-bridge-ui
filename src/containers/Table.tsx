import { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import detailsIcon from '~/assets/icons/details-arrow.svg';
import openLinkIcon from '~/assets/icons/open-link.svg';

import { createData, formatDataNumber, getTimestamps, replaceSpacesWithHyphens, truncateAddress } from '~/utils';
import { useChain, useCustomClient, useCustomTheme, useLogs, useTokenList } from '~/hooks';
import { SPagination, StatusChip } from '~/components';
import { AccountLogs } from '~/types';

export const ActivityTable = () => {
  const itemsPerPage = 6;
  const { customClient } = useCustomClient();
  const { fromChain } = useChain();
  const { fromTokens, toTokens } = useTokenList();
  const chainPath = replaceSpacesWithHyphens(fromChain?.name || '');
  const { depositLogs, withdrawLogs, setSelectedLog } = useLogs();
  const [orderedLogs, setOrderedLogs] = useState<AccountLogs[]>([]);

  const [paging, setPaging] = useState({ from: 0, to: itemsPerPage });

  const getOrderedLogs = useCallback(async () => {
    const accountLogs = [...(depositLogs?.accountLogs || []), ...(withdrawLogs?.accountLogs || [])];
    const blocks = await getTimestamps(accountLogs, customClient);

    const temp = accountLogs.map((log, index) => {
      return { ...log, timestamp: blocks[index].timestamp };
    });
    const orderedLogs = temp.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    return orderedLogs;
  }, [depositLogs?.accountLogs, withdrawLogs?.accountLogs, customClient]);

  const rows = useMemo(() => {
    const data = orderedLogs.reverse().map((eventLog) => {
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

  const handleOpenTransaction = (log: AccountLogs) => {
    setSelectedLog(log);
  };

  useEffect(() => {
    getOrderedLogs().then((logs) => {
      setOrderedLogs(logs);
    });
  }, [getOrderedLogs]);

  return (
    <TableContainer>
      <Table>
        <STableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Tx Hash</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </STableHead>

        <STableBody>
          {rows.slice(paging.from, paging.to).map((row) => (
            <STableRow key={row.txHash}>
              {/* Transaction type */}
              <TypeCell className='type'>{row.type}</TypeCell>

              {/* Amount */}
              <AmountCell>{row.amount}</AmountCell>

              {/* Transaction Hash */}
              <TxHashCell>
                <Link href='#'>
                  {truncateAddress(row.txHash)}
                  <Image src={openLinkIcon} alt='Open transaction in block explorer' />
                </Link>
              </TxHashCell>

              {/* Date & Time */}
              <DateTimeCell>{row.dateTime}</DateTimeCell>

              {/* Status */}
              <StatusCell>
                <StatusChip status={row.status} />
              </StatusCell>

              {/* Go to transaction detials */}
              <TableCell className='details-link'>
                <Link
                  onClick={() => handleOpenTransaction(row.log)}
                  href={{
                    pathname: '/[chain]/tx/[tx]',
                    query: { chain: chainPath, tx: row.txHash },
                  }}
                >
                  <Image src={detailsIcon} alt='Open transaction details page' />
                </Link>
              </TableCell>
            </STableRow>
          ))}
        </STableBody>
      </Table>
      <SPagination numberOfItems={rows.length} perPage={itemsPerPage} setPaging={setPaging} />
    </TableContainer>
  );
};

const STableHead = styled(TableHead)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    th: {
      fontSize: '1.2rem',
      color: currentTheme.steel[500],
      lineHeight: '1.8rem',
      padding: '1.2rem 2.4rem',
      borderBottom: `1px solid ${currentTheme.steel[700]}`,
    },
  };
});

const STableBody = styled(TableBody)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    fontSize: '1.4rem',
    lineHeight: '2rem',
    color: currentTheme.steel[100],
    fontWeight: 500,
    td: {
      padding: '2.2rem 1.8rem',
      minWidth: '13rem',
      borderBottom: `1px solid ${currentTheme.steel[700]}`,
    },
    'td:last-child': {
      minWidth: '6rem',
      width: '6rem',
    },
  };
});

const STableRow = styled(TableRow)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    '& .details-link': {
      padding: 0,
    },
    '& .details-link a': {
      display: 'flex',
      width: '100%',
      height: '6.4rem',
      alignItems: 'center',
      justifyContent: 'center',
    },

    '& .details-link a:hover': {
      transition: currentTheme.transition,
      backgroundColor: currentTheme.steel[800],
    },
  };
});

const TypeCell = styled(TableCell)(() => {
  return {
    fontWeight: 500,
  };
});

const AmountCell = styled(TableCell)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[300],
    fontWeight: 400,
  };
});

const TxHashCell = styled(TableCell)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.ghost[400],
    a: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
    },

    'a:hover': {
      textDecoration: 'underline',
    },
  };
});

const DateTimeCell = styled(TableCell)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[500],
    fontWeight: 400,
  };
});

const StatusCell = styled(TableCell)(() => {
  return {
    width: 'auto',
  };
});
