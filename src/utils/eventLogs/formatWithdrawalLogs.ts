import { GetLogsReturnType } from 'viem';
import { AccountLogs, CustomClients } from '~/types';
import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  messagePassedAbi,
  sentMessageExtensionABI,
} from '~/utils/parsedEvents';

export const formatETHWithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof ethBridgeInitiatedABI>,
  statusMap: { [hash: string]: { status: string } },
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Withdrawal', // Withdrawal ETH
    blockNumber: log.blockNumber,
    date: 0, // log.date,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.name,
    destinationChain: customClient.from.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    remoteToken: '0x0000000000000000000000000000000000000000',
    localToken: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    status: statusMap[log.transactionHash].status,
    from: log.args.from!,
    to: log.args.to!,
    amount: log.args.amount!,
    data: log.args.extraData,
  }));
};

export const formatERC20WithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof erc20BridgeInitiatedABI>,
  statusMap: { [hash: string]: { status: string } },
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Withdrawal', // Withdrawal ERC20
    blockNumber: log.blockNumber,
    date: 0,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.name,
    destinationChain: customClient.from.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: statusMap[log.transactionHash].status,
    from: log.args.from!,
    to: log.args.to!,
    amount: log.args.amount!,
    localToken: log.args.localToken!,
    remoteToken: log.args.remoteToken!,
    data: log.args.extraData,
  }));
};

export const formatMessageWithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof sentMessageExtensionABI>,
  statusMap: { [hash: string]: { status: string } },
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Withdrawal', // Withdrawal Message
    blockNumber: log.blockNumber,
    date: 0,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.name,
    destinationChain: customClient.from.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: statusMap[log.transactionHash].status,
    from: log.args.sender!,
    to: '0x',
    amount: log.args.value!,
    data: '0x',
  }));
};

export const formatCustomWithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof messagePassedAbi>,
  statusMap: { [hash: string]: { status: string } },
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Withdrawal', // Custom Withdrawal
    blockNumber: log.blockNumber,
    date: 0, // log.date,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.name,
    destinationChain: customClient.from.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: statusMap[log.transactionHash].status,
    from: log.args.sender!,
    to: log.args.target!,
    amount: log.args.value!,
    data: log.args.data!,
  }));
};
