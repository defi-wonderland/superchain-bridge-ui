import { CustomClients, WithdrawLogs } from '~/types';
import { Address } from 'viem';
import { GetWithdrawalStatusParameters } from 'viem/op-stack';

import { getMsgHashes } from '../transactions/helpers';
import { getFailedTransactionLogs } from '../transactions/getFailedTxs';
import { getAllWithdrawalLogs } from './getWithdrawalLogs';
import {
  formatCustomWithdrawalLogs,
  formatERC20WithdrawalLogs,
  formatETHWithdrawalLogs,
  formatMessageWithdrawalLogs,
} from './formatWithdrawalLogs';

interface GetWithdrawalLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getWithdrawLogs = async ({
  customClient,
  userAddress,
}: GetWithdrawalLogsParameters): Promise<WithdrawLogs> => {
  if (!userAddress) throw new Error('No user address provided');

  const { customLogs, messageLogs, ethLogs, erc20Logs } = await getAllWithdrawalLogs({
    customClient,
    userAddress,
  });

  const logs = [...customLogs, ...messageLogs, ...ethLogs, ...erc20Logs];

  // Get all receipts
  const receipts = await Promise.all(
    logs.map(({ transactionHash }) => {
      return customClient.to.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  // Get all status of the withdrawals
  const status = await Promise.all(
    receipts.map((receipt) => {
      return customClient.from.public.getWithdrawalStatus({
        receipt,
        targetChain: customClient.to.public.chain,
      } as GetWithdrawalStatusParameters);
    }),
  );

  const statusMap = Object.fromEntries(
    status.map((status, i) => {
      return [logs[i].transactionHash, { status: status, receipt: receipts[i] }];
    }),
  );

  // Get the message hashes and args
  const messageData = getMsgHashes(
    messageLogs.map(({ transactionHash }) => statusMap[transactionHash].receipt),
    'message',
  );
  const erc20Data = getMsgHashes(
    erc20Logs.map(({ transactionHash }) => statusMap[transactionHash].receipt),
    'erc20',
  );
  const ethData = getMsgHashes(
    ethLogs.map(({ transactionHash }) => statusMap[transactionHash].receipt),
    'eth',
  );

  const failedData = { ...erc20Data, ...messageData, ...ethData };
  const msgHashes = Object.values(failedData).map(({ msgHash }) => msgHash);

  const failedTxs = await getFailedTransactionLogs({
    // for withdrawal txs, should be the L1 client
    publicClient: customClient.from.public,
    crossDomainMessenger: customClient.from.contracts.crossDomainMessenger,
    userAddress,
    msgHashes,
  });

  const formattedEthLogs = formatETHWithdrawalLogs(customClient, ethLogs, failedTxs, failedData, statusMap);
  const formattedErc20Logs = formatERC20WithdrawalLogs(customClient, erc20Logs, failedTxs, failedData, statusMap);
  const formattedMessageLogs = formatMessageWithdrawalLogs(customClient, messageLogs, failedTxs, failedData, statusMap);
  const formattedCustomLogs = formatCustomWithdrawalLogs(customClient, customLogs, statusMap);

  const accountLogs = [
    ...formattedCustomLogs.accountLogs,
    ...formattedMessageLogs.accountLogs,
    ...formattedEthLogs.accountLogs,
    ...formattedErc20Logs.accountLogs,
  ];

  // temporary logs
  console.log({
    accountLogs,
  });

  return {
    accountLogs,
  };
};
