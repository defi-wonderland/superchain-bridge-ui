import { Chain, PublicClient, formatUnits, parseUnits } from 'viem';
import { contracts } from './variables';
import { AccountLogs, CustomClients, OpContracts } from '~/types';

export const replaceSpacesWithHyphens = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

export const getFromContracts = (fromChain: Chain, toChain: Chain): OpContracts => {
  const key = `${fromChain.id}-${toChain.id}`;
  return contracts[key];
};

export const getToContracts = (fromChain: Chain, toChain: Chain): OpContracts => {
  const key = `${toChain.id}-${fromChain.id}`;
  return contracts[key];
};

export const getUsdBalance = (price: number, balance: string, decimals: number, compact: boolean = false): string => {
  const priceBN = parseUnits(price.toString(), decimals);
  const balanceBN = parseUnits(balance, decimals);
  const result = (priceBN * balanceBN) / BigInt(10 ** decimals);
  return formatDataNumber(result.toString(), 18, 2, true, compact);
};

/**
 * @dev Format a number to a string
 * @param input BigNumber string to format
 * @param decimals Number of BigNumber's decimals
 * @param formatDecimal Number of decimals to format to
 * @param currency Format as currency
 * @param compact Format as compact
 * @returns Formatted number
 */
export function formatDataNumber(
  input: string | number,
  decimals = 18,
  formatDecimal = 2,
  currency?: boolean,
  compact?: boolean,
) {
  let res: number = Number.parseFloat(input.toString());
  if (res === 0) return `${currency ? '$0' : '0'}`;

  if (decimals !== 0) res = Number.parseFloat(formatUnits(BigInt(input || 0), decimals));

  if (res < 0.01) return `${currency ? '$' : ''}<0.01`;

  const userNotation = compact ? 'compact' : 'standard';
  const notation = res > 1e12 ? 'scientific' : userNotation;

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: formatDecimal,
    notation: notation,
    style: currency ? 'currency' : 'decimal',
    currency: 'USD',
  }).format(res);
}

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return '-';
  const date = new Date(Number(timestamp) * 1000);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getTimestamp = async (publicClient: PublicClient, blockNumber: bigint) => {
  const blockData = await publicClient.getBlock({ blockNumber });
  return blockData.timestamp.toString();
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'finalized':
      return 'Completed';
    case 'ready-to-finalize':
      return 'Ready to finalize';
    case 'ready-to-prove':
      return 'Ready to prove';
    case 'waiting-to-finalize':
      return 'Waiting to finalize';
    case 'waiting-to-prove':
      return 'Waiting to prove';
    default:
      return 'Failed';
  }
};

export const getTxDetailsButtonText = (status: string) => {
  switch (status) {
    case 'ready-to-prove':
      return 'Prove Withdrawal';
    case 'ready-to-finalize':
      return 'Finalize Withdrawal';
    default:
      return 'Replay Transaction';
  }
};

export const getTimestamps = (logs: AccountLogs[], customClient: CustomClients) => {
  const blocks = logs.map((log) => {
    const logType = log.type === 'Withdrawal' ? 'to' : 'from';
    return customClient[logType].public.getBlock({ blockNumber: log.blockNumber });
  });

  return Promise.all(blocks);
};

export const createData = (
  type: string,
  amount: string,
  txHash: string,
  timestamp: string,
  status: string,
  log: AccountLogs,
) => {
  return { type, amount, txHash, dateTime: formatTimestamp(timestamp), status, log };
};
