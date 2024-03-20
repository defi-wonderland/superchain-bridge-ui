import { Address } from 'viem';
import { extractTransactionDepositedLogs, getL2TransactionHash } from 'viem/op-stack';

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

  try {
    const { logsFromEthDeposited, logsFromErc20Deposited, logsFromMessagesDeposited, logsFromForcedTransactions } =
      await getAllDepositLogs({ customClient, userAddress });

    const logs = [
      ...logsFromEthDeposited,
      ...logsFromErc20Deposited,
      ...logsFromMessagesDeposited,
      ...logsFromForcedTransactions,
    ];

    const receipts = await Promise.all(
      logs.map(({ transactionHash }) => {
        return customClient.from.public.getTransactionReceipt({ hash: transactionHash });
      }),
    );

    const receiptsMap = Object.fromEntries(
      receipts.map((receipt, i) => {
        return [
          logs[i].transactionHash,
          {
            receipt,
            l2Hash: getL2TransactionHash({
              log: extractTransactionDepositedLogs(receipt)[0],
            }),
          },
        ];
      }),
    );

    const customDataMsghashMap = getMsgHashes(
      logsFromMessagesDeposited.map(({ transactionHash }) => receiptsMap[transactionHash].receipt),
      'message',
    );

    const erc20MsghashMap = getMsgHashes(
      logsFromErc20Deposited.map(({ transactionHash }) => receiptsMap[transactionHash].receipt),
      'erc20',
    );

    const failedData = { ...erc20MsghashMap, ...customDataMsghashMap };
    const msgHashes = Object.values(failedData).map(({ msgHash }) => msgHash);

    const failedTxs = await getFailedTransactionLogs({
      // for deposit txs, should be the L2 client
      publicClient: customClient.to.public,
      crossDomainMessenger: customClient.to.contracts.crossDomainMessenger,
      userAddress,
      msgHashes,
    });

    const formattedLogsFromEthDeposited = formatDepositETHLogs(customClient, logsFromEthDeposited, receiptsMap);
    const formattedLogsFromForcedTxs = formatForceDepositLogs(customClient, logsFromForcedTransactions, receiptsMap);

    const formattedLogsFromErc20Deposited = formatERC20DepositLogs(
      customClient,
      logsFromErc20Deposited,
      failedTxs,
      failedData,
      receiptsMap,
    );
    const formattedLogsFromMessages = formatMessageDepositLogs(
      customClient,
      logsFromMessagesDeposited,
      failedTxs,
      failedData,
      receiptsMap,
    );

    const accountLogs = [
      ...formattedLogsFromEthDeposited.accountLogs,
      ...formattedLogsFromErc20Deposited.accountLogs,
      ...formattedLogsFromMessages.accountLogs,
      ...formattedLogsFromForcedTxs.accountLogs,
    ];

    // temporary log
    console.log({
      accountLogs,
    });

    return {
      accountLogs,
    };
  } catch (error) {
    console.warn(error);

    return {
      accountLogs: [],
    };
  }
};
