import { Address } from 'viem';
import { CustomClients } from '~/types';
import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  messagePassedAbi,
  sentMessageExtensionABI,
} from '~/utils/parsedEvents';

interface GetWithdrawalLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}

export const getAllWithdrawalLogs = async ({ customClient, userAddress }: GetWithdrawalLogsParameters) => {
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

  return {
    customLogs: logsFromL2ToL1MessagePasser,
    messageLogs: logsFromL2CrossDomain,
    ethLogs: ethLogsFromL2StandarBridge,
    erc20Logs: erc20LogsFromL2StandarBridge,
  };
};
