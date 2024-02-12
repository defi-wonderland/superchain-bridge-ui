import { CustomClients, DepositLogs } from '~/types';
import { Address, Hex } from 'viem';

import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  failedRelayedMessageABI,
  sentMessageExtensionABI,
  transactionDepositedABI,
} from '../parsedEvents';
import { getMsgHashes } from './helpers';

interface GetDepositLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getDepositLogs = async ({ customClient, userAddress }: GetDepositLogsParameters): Promise<DepositLogs> => {
  if (!userAddress) throw new Error('No user address provided');

  const logsFromEthDepositedPromise = customClient.from.public.getLogs({
    address: customClient.from.contracts.standardBridge, // L1 standard bridge
    event: ethBridgeInitiatedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const logsFromErc20DepositedPromise = customClient.from.public.getLogs({
    address: customClient.from.contracts.standardBridge, // L1 standard bridge
    event: erc20BridgeInitiatedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const logsFromMessagesDepositedPromise = customClient.from.public.getLogs({
    address: customClient.from.contracts.crossDomainMessenger, // L1 cross domain messenger
    event: sentMessageExtensionABI,
    args: {
      sender: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const logsFromForcedTransactionsPromise = customClient.from.public.getLogs({
    address: customClient.from.contracts.portal, // L1 portal
    event: transactionDepositedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
    strict: false,
  });

  const [logsFromEthDeposited, logsFromErc20Deposited, logsFromMessagesDeposited, logsFromForcedTransactions] =
    await Promise.all([
      logsFromEthDepositedPromise,
      logsFromErc20DepositedPromise,
      logsFromMessagesDepositedPromise,
      logsFromForcedTransactionsPromise,
    ]);

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

  const msgHashesFromMessages = getMsgHashes(messageReceipts, 'message');
  const msgHashesFromErc20 = getMsgHashes(erc20Receipts, 'erc20');

  // TODO: implement the following (depends on the final design of the user history page)
  // - formatEthDeposits()
  // - formatErc20Deposits()
  // - formatMessageDeposits()
  // - formatForcedTransactions()

  const logs = [
    ...logsFromEthDeposited,
    ...logsFromErc20Deposited,
    ...logsFromMessagesDeposited,
    ...logsFromForcedTransactions,
  ];

  const msgHashes = [...msgHashesFromMessages, ...msgHashesFromErc20];

  // Receipts to get the L2 transaction status
  // const receipts = await Promise.all(
  //   logs.map(({ transactionHash }) => {
  //     return customClient.from.public.getTransactionReceipt({ hash: transactionHash });
  //   }),
  // );

  // temporary log
  console.log({
    logsFromEthDeposited,
    logsFromErc20Deposited,
    logsFromMessagesDeposited,
    logsFromForcedTransactions,
    msgHashes,
  });

  // temporary call, to be removed
  getFailedTransactionLogs({ customClient, userAddress, msgHashes });

  return { logs, receipts: [], msgHashes };
};

interface GetFailedTransactionLogsParameters {
  customClient: CustomClients;
  userAddress: Address;
  msgHashes: Hex[];
}
export const getFailedTransactionLogs = async ({ customClient, msgHashes }: GetFailedTransactionLogsParameters) => {
  const errorLogs = await customClient.to.public.getLogs({
    address: customClient.to.contracts.crossDomainMessenger, // L2 cross domain messenger
    event: failedRelayedMessageABI,
    args: {
      msgHash: msgHashes,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  console.log({ errorLogs });
};
