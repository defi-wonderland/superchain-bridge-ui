import { GetLogsReturnType, TransactionReceipt } from 'viem';
import { GetWithdrawalStatusReturnType as StatusType } from 'viem/op-stack';
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
  statusMap: { [hash: string]: { status: StatusType; receipt: TransactionReceipt } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => statusMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => ({
    type: 'Withdrawal', // Withdrawal ETH
    blockNumber: log.blockNumber,
    timestamp: 0, // log.date,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.id,
    destinationChain: customClient.from.public.chain!.id,
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
    receipt: statusMap[log.transactionHash].receipt,
  }));

  return { accountLogs, receipts };
};

export const formatERC20WithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof erc20BridgeInitiatedABI>,
  statusMap: { [hash: string]: { status: StatusType; receipt: TransactionReceipt } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => statusMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => ({
    type: 'Withdrawal', // Withdrawal ERC20
    blockNumber: log.blockNumber,
    timestamp: 0,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.id,
    destinationChain: customClient.from.public.chain!.id,
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
    receipt: statusMap[log.transactionHash].receipt,
  }));

  return { accountLogs, receipts };
};

export const formatMessageWithdrawalLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof sentMessageExtensionABI>,
  statusMap: { [hash: string]: { status: StatusType; receipt: TransactionReceipt } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => statusMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => ({
    type: 'Withdrawal', // Withdrawal Message
    blockNumber: log.blockNumber,
    timestamp: 0,
    transactionHash: log.transactionHash,
    originChain: customClient.to.public.chain!.id,
    destinationChain: customClient.from.public.chain!.id,
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: statusMap[log.transactionHash].status,
    from: log.args.sender!,
    to: '0x',
    // amount: log.args.value!,
    data: '0x',
    receipt: statusMap[log.transactionHash].receipt,
  }));

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
    bridge: 'OP Gateway',
    fees: '0',
    transactionTime: '1m',
    status: statusMap[log.transactionHash].status,
    from: log.args.sender!,
    to: log.args.target!,
    remoteToken: '0x0000000000000000000000000000000000000000',
    localToken: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    amount: log.args.value!,
    data: log.args.data!,
    receipt: statusMap[log.transactionHash].receipt,
  }));

  return { accountLogs, receipts };
};
