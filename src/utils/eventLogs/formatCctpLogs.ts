import { TransactionReceipt } from 'viem';

import { AccountLogs, CustomClients } from '~/types';
import { UsdcBurnData } from '~/types';

export const formatCctpLogs = (customClient: CustomClients, logs: UsdcBurnData): { accountLogs: AccountLogs[] } => {
  const accountLogs: AccountLogs[] = logs.map((log) => ({
    type: 'CCTP',
    blockNumber: log.sourceBlockNumber,
    timestamp: 0,
    transactionHash: log.sourceHash,
    l2TransactionHash: log.destinationHash,
    originChain: customClient.from.public.chain!.id,
    destinationChain: customClient.to.public.chain!.id,
    bridge: 'Cross-Chain Transfer Protocol',
    fees: '-',
    transactionTime: '2m',
    status: log.received ? 'finalized' : 'ready-to-finalize',
    from: log.depositor!,
    to: log.mintRecipient,
    localToken: log.burnToken,
    remoteToken: log.burnToken,
    amount: log.amount,
    receipt: {} as TransactionReceipt, // temporary
  }));

  return { accountLogs };
};
