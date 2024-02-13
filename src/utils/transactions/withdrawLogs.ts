import { CustomClients, WithdrawLogs } from '~/types';
import { Address } from 'viem';
import { GetWithdrawalStatusParameters } from 'viem/op-stack';

import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  messagePassedAbi,
  sentMessageExtensionABI,
} from '../parsedEvents';
import { getMsgHashes } from './helpers';
import { getFailedTransactionLogs } from './getFailedTxs';

interface GetWithdrawalLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getWithdrawLogs = async ({
  customClient,
  userAddress,
}: GetWithdrawalLogsParameters): Promise<WithdrawLogs> => {
  if (!userAddress) throw new Error('No user address provided');

  const logsFromL2ToL1MessagePasserPromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.l2ToL1MessagePasser,
    event: messagePassedAbi,
    args: {
      sender: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const logsFromL2CrossDomainPromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.crossDomainMessenger, // L2 cross domain messenger
    event: sentMessageExtensionABI,
    args: {
      sender: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const ethLogsFromL2StandarBridgePromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.standardBridge, // L2 standard bridge
    event: ethBridgeInitiatedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const erc20LogsFromL2StandarBridgePromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.standardBridge, // L2 standard bridge
    event: erc20BridgeInitiatedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const [logsFromL2ToL1MessagePasser, logsFromL2CrossDomain, ethLogsFromL2StandarBridge, erc20LogsFromL2StandarBridge] =
    await Promise.all([
      logsFromL2ToL1MessagePasserPromise,
      logsFromL2CrossDomainPromise,
      ethLogsFromL2StandarBridgePromise,
      erc20LogsFromL2StandarBridgePromise,
    ]);

  const logs = [
    ...logsFromL2ToL1MessagePasser,
    ...logsFromL2CrossDomain,
    ...ethLogsFromL2StandarBridge,
    ...erc20LogsFromL2StandarBridge,
  ];

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

  // Get the message hashes and args

  const messageReceipts = await Promise.all(
    logsFromL2CrossDomain.map(({ transactionHash }) => {
      return customClient.to.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  const erc20Receipts = await Promise.all(
    erc20LogsFromL2StandarBridge.map(({ transactionHash }) => {
      return customClient.to.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );
  const ethReceipts = await Promise.all(
    ethLogsFromL2StandarBridge.map(({ transactionHash }) => {
      return customClient.to.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  const { msgHashes: msgHashesFromMessages, args: argsFromMessages } = getMsgHashes(messageReceipts, 'message');
  const { msgHashes: msgHashesFromErc20, args: argsFromErc20 } = getMsgHashes(erc20Receipts, 'erc20');
  const { msgHashes: msgHashesFromEth, args: argsFromEth } = getMsgHashes(ethReceipts, 'eth');

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
    logsFromL2ToL1MessagePasser,
    logsFromL2CrossDomain,
    ethLogsFromL2StandarBridge,
    erc20LogsFromL2StandarBridge,
    receipts,
    status,
    msgHashes,
    failedTxs,
    args,
  });

  return {
    logs,
    receipts,
    status,
    msgHashes,
    failedTxs,
    args,
  };
};
