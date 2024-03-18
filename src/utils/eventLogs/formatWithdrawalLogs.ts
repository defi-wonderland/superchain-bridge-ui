import { GetLogsReturnType, TransactionReceipt } from 'viem';
import { GetWithdrawalStatusReturnType as StatusType } from 'viem/op-stack';
import { AccountLogs, CustomClients } from '~/types';
import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  failedRelayedMessageABI,
  messagePassedAbi,
  sentMessageExtensionABI,
} from '~/utils/parsedEvents';
import { GetMsgHashesReturn } from '../transactions';

export const formatETHWithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof ethBridgeInitiatedABI>,
  failedLogs: GetLogsReturnType<typeof failedRelayedMessageABI>,
  msgData: GetMsgHashesReturn,
  statusMap: { [hash: string]: { status: StatusType; receipt: TransactionReceipt } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => statusMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => {
    const { args, msgHash } = msgData[log.transactionHash];
    const isFailed = failedLogs.some((failedLog) => failedLog.args.msgHash === msgHash);

    return {
      type: 'Withdrawal', // Withdrawal ETH
      blockNumber: log.blockNumber,
      timestamp: 0, // log.date,
      transactionHash: log.transactionHash,
      originChain: customClient.to.public.chain!.id,
      destinationChain: customClient.from.public.chain!.id,
      bridge: 'OP Standard Bridge',
      fees: '-',
      transactionTime: '2m',
      remoteToken: '0x0000000000000000000000000000000000000000',
      localToken: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      status: isFailed ? 'failed' : statusMap[log.transactionHash].status,
      from: log.args.from!,
      to: log.args.to!,
      amount: log.args.amount!,
      receipt: statusMap[log.transactionHash].receipt,
      args: args,
    };
  });

  return { accountLogs, receipts };
};

export const formatERC20WithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof erc20BridgeInitiatedABI>,
  failedLogs: GetLogsReturnType<typeof failedRelayedMessageABI>,
  msgData: GetMsgHashesReturn,
  statusMap: { [hash: string]: { status: StatusType; receipt: TransactionReceipt } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => statusMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => {
    const { args, msgHash } = msgData[log.transactionHash];
    const isFailed = failedLogs.some((failedLog) => failedLog.args.msgHash === msgHash);

    return {
      type: 'Withdrawal', // Withdrawal ERC20
      blockNumber: log.blockNumber,
      timestamp: 0,
      transactionHash: log.transactionHash,
      originChain: customClient.to.public.chain!.id,
      destinationChain: customClient.from.public.chain!.id,
      bridge: 'OP Standard Bridge',
      fees: '-',
      transactionTime: '2m',
      status: isFailed ? 'failed' : statusMap[log.transactionHash].status,
      from: log.args.from!,
      to: log.args.to!,
      amount: log.args.amount!,
      localToken: log.args.localToken!,
      remoteToken: log.args.remoteToken!,
      receipt: statusMap[log.transactionHash].receipt,
      args: args,
    };
  });

  return { accountLogs, receipts };
};

export const formatMessageWithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof sentMessageExtensionABI>,
  failedLogs: GetLogsReturnType<typeof failedRelayedMessageABI>,
  msgData: GetMsgHashesReturn,
  statusMap: { [hash: string]: { status: StatusType; receipt: TransactionReceipt } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => statusMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => {
    const { args, msgHash } = msgData[log.transactionHash];
    const isFailed = failedLogs.some((failedLog) => failedLog.args.msgHash === msgHash);

    return {
      type: 'Withdrawal', // Withdrawal Message
      blockNumber: log.blockNumber,
      timestamp: 0,
      transactionHash: log.transactionHash,
      originChain: customClient.to.public.chain!.id,
      destinationChain: customClient.from.public.chain!.id,
      bridge: 'OP Standard Bridge',
      fees: '-',
      transactionTime: '2m',
      status: isFailed ? 'failed' : statusMap[log.transactionHash].status,
      from: log.args.sender!,
      to: msgData[log.transactionHash].args.target!,
      data: msgData[log.transactionHash].args.message!,
      receipt: statusMap[log.transactionHash].receipt,
      args: args,
    };
  });

  return { accountLogs, receipts };
};

export const formatCustomWithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof messagePassedAbi>,
  statusMap: { [hash: string]: { status: StatusType; receipt: TransactionReceipt } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => statusMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => ({
    type: 'Withdrawal', // Custom Withdrawal
    blockNumber: log.blockNumber,
    timestamp: 0,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.id,
    destinationChain: customClient.from.public.chain!.id,
    bridge: 'OP Standard Bridge',
    fees: '-',
    transactionTime: '2m',
    status: statusMap[log.transactionHash].status,
    from: log.args.sender!,
    to: log.args.target!,
    data: log.args.data!,
    receipt: statusMap[log.transactionHash].receipt,
  }));

  return { accountLogs, receipts };
};
