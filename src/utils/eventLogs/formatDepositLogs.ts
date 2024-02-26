import { GetLogsReturnType } from 'viem';
import { AccountLogs, CustomClients } from '~/types';
import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  sentMessageExtensionABI,
  transactionDepositedABI,
} from '~/utils/parsedEvents';

export const formatDepositETHLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof ethBridgeInitiatedABI>,
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Deposit', // Deposit ETH
    blockNumber: log.blockNumber,
    date: 0, // log.date,
    transactionHash: log.transactionHash,
    originChain: customClient.from.public.chain!.name,
    destinationChain: customClient.to.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: 'finalized',
    from: log.args.from!,
    to: log.args.to!,
    localToken: '0x0000000000000000000000000000000000000000',
    remoteToken: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    amount: log.args.amount!,
    data: log.args.extraData,
  }));
};

export const formatERC20DepositLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof erc20BridgeInitiatedABI>,
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Deposit', // Deposit ERC20
    blockNumber: log.blockNumber,
    date: 0, // log.date,
    transactionHash: log.transactionHash,
    originChain: customClient.from.public.chain!.name,
    destinationChain: customClient.to.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: 'finalized',
    from: log.args.from!,
    to: log.args.to!,
    amount: log.args.amount!,
    localToken: log.args.localToken!,
    remoteToken: log.args.remoteToken!,
    data: log.args.extraData,
  }));
};

export const formatMessageDepositLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof sentMessageExtensionABI>,
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Deposit', // Deposit Message
    blockNumber: log.blockNumber,
    date: 0, // log.date,
    transactionHash: log.transactionHash,
    originChain: customClient.from.public.chain!.name,
    destinationChain: customClient.to.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: 'finalized',
    from: log.args.sender!,
    to: '0x',
    amount: log.args.value!,
    data: '0x',
  }));
};

export const formatForceDepositLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof transactionDepositedABI>,
): AccountLogs[] => {
  return logs.map((log) => ({
    type: 'Force Tx', // Force transaction
    blockNumber: log.blockNumber,
    date: 0, // log.date,
    transactionHash: log.transactionHash,
    originChain: customClient.from.public.chain!.name,
    destinationChain: customClient.to.public.chain!.name,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: 'finalized',
    from: log.args.from!,
    to: log.args.to!,
    amount: 0n,
    data: log.args.opaqueData,
  }));
};
