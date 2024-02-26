import { Address } from 'viem';
import { CustomClients, DepositLogs } from '~/types';

import { getMsgHashes } from '../transactions/helpers';
import { getFailedTransactionLogs } from '../transactions/getFailedTxs';
import { getAllDepositLogs } from './getDepositLogs';
import {
  formatDepositETHLogs,
  formatERC20DepositLogs,
  formatForceDepositLogs,
  formatMessageDepositLogs,
} from './formatDepositLogs';

interface GetDepositLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getDepositLogs = async ({ customClient, userAddress }: GetDepositLogsParameters): Promise<DepositLogs> => {
  if (!userAddress) throw new Error('No user address provided');

  const { logsFromEthDeposited, logsFromErc20Deposited, logsFromMessagesDeposited, logsFromForcedTransactions } =
    await getAllDepositLogs({ customClient, userAddress });

  const formattedLogsFromEthDeposited = formatDepositETHLogs(customClient, logsFromEthDeposited);
  const formattedLogsFromErc20Deposited = formatERC20DepositLogs(customClient, logsFromErc20Deposited);
  const formattedLogsFromMessagesDeposited = formatMessageDepositLogs(customClient, logsFromMessagesDeposited);
  const formattedLogsFromForcedTransactions = formatForceDepositLogs(customClient, logsFromForcedTransactions);

  const messageReceipts = await Promise.all(
    logsFromMessagesDeposited.map(({ transactionHash }) => {
      return customClient.from.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  const erc20Receipts = await Promise.all(
    logsFromErc20Deposited.map(({ transactionHash }) => {
      return customClient.from.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  // Receipts to get the L2 transaction status
  const receipts = [...messageReceipts, ...erc20Receipts];
  // const receipts = await Promise.all(
  //   logs.map(({ transactionHash }) => {
  //     return customClient.from.public.getTransactionReceipt({ hash: transactionHash });
  //   }),
  // );

  const { msgHashes: msgHashesFromMessages, args: argsFromMessages } = getMsgHashes(messageReceipts, 'message');
  const { msgHashes: msgHashesFromErc20, args: argsFromErc20 } = getMsgHashes(erc20Receipts, 'erc20');

  const logs = [
    ...logsFromEthDeposited,
    ...logsFromErc20Deposited,
    ...logsFromMessagesDeposited,
    ...logsFromForcedTransactions,
  ];

  const msgHashes = [...msgHashesFromMessages, ...msgHashesFromErc20];
  const args = [...argsFromMessages, ...argsFromErc20];

  const failedTxs = await getFailedTransactionLogs({
    // for deposit txs, should be the L2 client
    publicClient: customClient.to.public,
    crossDomainMessenger: customClient.to.contracts.crossDomainMessenger,
    userAddress,
    msgHashes,
  });

  // temporary log
  console.log({
    messageReceipts,
    erc20Receipts,
    logsFromEthDeposited,
    logsFromErc20Deposited,
    logsFromMessagesDeposited,
    logsFromForcedTransactions,
    msgHashes,
    failedTxs,
    args,
  });

  const accountLogs = [
    ...formattedLogsFromEthDeposited,
    ...formattedLogsFromErc20Deposited,
    ...formattedLogsFromMessagesDeposited,
    ...formattedLogsFromForcedTransactions,
  ];

  return {
    accountLogs,
    logs,
    receipts,
    msgHashes,
    failedTxs,
    args,
  };
};
