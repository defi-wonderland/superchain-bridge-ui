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

  const formattedEthLogs = formatETHWithdrawalLogs(customClient, ethLogs, statusMap);
  const formattedErc20Logs = formatERC20WithdrawalLogs(customClient, erc20Logs, statusMap);
  const formattedMessageLogs = formatMessageWithdrawalLogs(customClient, messageLogs, statusMap);
  const formattedCustomLogs = formatCustomWithdrawalLogs(customClient, customLogs, statusMap);

  const accountLogs = [
    ...formattedCustomLogs.accountLogs,
    ...formattedMessageLogs.accountLogs,
    ...formattedEthLogs.accountLogs,
    ...formattedErc20Logs.accountLogs,
  ];

  // Get the message hashes and args
  const { msgHashes: msgHashesFromMessages, args: argsFromMessages } = getMsgHashes(
    formattedMessageLogs.receipts,
    'message',
  );
  const { msgHashes: msgHashesFromErc20, args: argsFromErc20 } = getMsgHashes(formattedErc20Logs.receipts, 'erc20');
  const { msgHashes: msgHashesFromEth, args: argsFromEth } = getMsgHashes(formattedEthLogs.receipts, 'eth');

  const msgHashes = [...msgHashesFromMessages, ...msgHashesFromErc20, ...msgHashesFromEth];
  const args = [...argsFromMessages, ...argsFromErc20, ...argsFromEth];

  const failedTxs = await getFailedTransactionLogs({
    // for withdrawal txs, should be the L1 client
    publicClient: customClient.from.public,
    crossDomainMessenger: customClient.from.contracts.crossDomainMessenger,
    userAddress,
    msgHashes,
  });

  // temporary logs
  console.log({
    accountLogs,
    msgHashes,
    failedTxs,
    args,
  });

  return {
    accountLogs,
    msgHashes,
    failedTxs,
    args,
  };
};
