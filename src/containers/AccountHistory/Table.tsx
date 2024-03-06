import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import detailsIcon from '~/assets/icons/details-arrow.svg';
import openLinkIcon from '~/assets/icons/open-link.svg';
import noActivityIcon from '~/assets/icons/no-activity.svg';

import { chainData, createData, replaceSpacesWithHyphens, truncateAddress } from '~/utils';
import { useChain, useCustomTheme, useLogs } from '~/hooks';
import { SPagination, StatusChip } from '~/components';
import { AccountLogs } from '~/types';

interface ActivityTableProps {
  rows: ReturnType<typeof createData>[];
}
export const ActivityTable = ({ rows = [] }: ActivityTableProps) => {
  const itemsPerPage = 6;
  const { fromChain } = useChain();
  const { setSelectedLog } = useLogs();
  const chainPath = replaceSpacesWithHyphens(fromChain?.name || '');
  const [paging, setPaging] = useState({ from: 0, to: itemsPerPage });

  const handleOpenTransaction = (log: AccountLogs) => {
    setSelectedLog(log);
  };

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

        {!!rows.length && (
          <STableBody>
            {rows.slice(paging.from, paging.to).map((row) => (
              <STableRow key={row.txHash}>
                {/* Transaction type */}
                <TypeCell className='type'>{row.type}</TypeCell>

                {/* Amount */}
                <AmountCell>{row.amount}</AmountCell>

                {/* Transaction Hash */}
                <TxHashCell>
                  <Link href={`${chainData[fromChain.id].explorer}tx/${row.txHash}`} target='_blank'>
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
        )}
      </Table>

      {!rows.length && (
        <NoActivityContainer>
          <Image src={noActivityIcon} alt='No activity' />
          <Typography variant='body1'>This account has no recent activity...</Typography>
        </NoActivityContainer>
      )}

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

const NoActivityContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    padding: '3rem 0',
    img: {
      background: currentTheme.steel[700],
      border: `1.6rem solid ${currentTheme.steel[800]}`,
      padding: '1rem',
      borderRadius: '50%',
      height: '11.2rem',
      width: '11.2rem',
    },
    p: {
      color: currentTheme.steel[500],
      fontSize: '1.6rem',
      fontWeight: 500,
      lineHeight: '2.24rem',
    },
  };
});
