import { Address } from 'viem';
import { CustomClients } from '~/types';
import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  sentMessageExtensionABI,
  transactionDepositedABI,
} from '~/utils/parsedEvents';

interface GetAllDepositLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}

export const getAllDepositLogs = async ({ customClient, userAddress }: GetAllDepositLogsParameters) => {
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

  const logsFromMessagesDepositedExtensionPromise = customClient.from.public.getLogs({
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
      logsFromMessagesDepositedExtensionPromise,
      logsFromForcedTransactionsPromise,
    ]);

  return {
    logsFromEthDeposited,
    logsFromErc20Deposited,
    logsFromMessagesDeposited,
    logsFromForcedTransactions,
  };
};
