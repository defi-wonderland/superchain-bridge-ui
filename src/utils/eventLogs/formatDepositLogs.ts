import { GetLogsReturnType, Hex, TransactionReceipt } from 'viem';
import { opaqueDataToDepositData } from 'viem/op-stack';

import { AccountLogs, CustomClients } from '~/types';
import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  failedRelayedMessageABI,
  sentMessageExtensionABI,
  transactionDepositedABI,
} from '~/utils/parsedEvents';
import { GetMsgHashesReturn } from '../transactions';

export const formatDepositETHLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof ethBridgeInitiatedABI>,
  receiptsMap: { [hash: string]: { receipt: TransactionReceipt; l2Hash: Hex } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => receiptsMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => ({
    type: 'Deposit', // Deposit ETH
    blockNumber: log.blockNumber,
    timestamp: 0,
    transactionHash: log.transactionHash,
    l2TransactionHash: receiptsMap[log.transactionHash].l2Hash,
    originChain: customClient.from.public.chain!.id,
    destinationChain: customClient.to.public.chain!.id,
    bridge: 'OP Standard Bridge',
    fees: '-',
    transactionTime: '2m',
    status: 'finalized',
    from: log.args.from!,
    to: log.args.to!,
    localToken: '0x0000000000000000000000000000000000000000',
    remoteToken: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    amount: log.args.amount!,
    receipt: receiptsMap[log.transactionHash].receipt,
  }));

  return { accountLogs, receipts };
};

export const formatERC20DepositLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof erc20BridgeInitiatedABI>,
  failedLogs: GetLogsReturnType<typeof failedRelayedMessageABI>,
  msgData: GetMsgHashesReturn,
  receiptsMap: { [hash: string]: { receipt: TransactionReceipt; l2Hash: Hex } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => receiptsMap[transactionHash].receipt);

  const accountLogs = logs.map((log) => {
    const { args, msgHash } = msgData[log.transactionHash];
    const isFailed = failedLogs.some((failedLog) => failedLog.args.msgHash === msgHash);

    return {
      type: 'Deposit', // Deposit ERC20
      blockNumber: log.blockNumber,
      timestamp: 0,
      transactionHash: log.transactionHash,
      l2TransactionHash: receiptsMap[log.transactionHash].l2Hash,
      originChain: customClient.from.public.chain!.id,
      destinationChain: customClient.to.public.chain!.id,
      bridge: 'OP Standard Bridge',
      fees: '-',
      transactionTime: '2m',
      status: isFailed ? 'failed' : 'finalized',
      from: log.args.from!,
      to: log.args.to!,
      amount: log.args.amount!,
      localToken: log.args.localToken!,
      remoteToken: log.args.remoteToken!,
      receipt: receiptsMap[log.transactionHash].receipt,
      args: args,
    };
  });

  return { accountLogs, receipts };
};

export const formatMessageDepositLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof sentMessageExtensionABI>,
  failedLogs: GetLogsReturnType<typeof failedRelayedMessageABI>,
  msgData: GetMsgHashesReturn,
  receiptsMap: { [hash: string]: { receipt: TransactionReceipt; l2Hash: Hex } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => receiptsMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => {
    const { args, msgHash } = msgData[log.transactionHash];
    const isFailed = failedLogs.some((failedLog) => failedLog.args.msgHash === msgHash);

    return {
      type: 'Deposit', // Deposit Message
      blockNumber: log.blockNumber,
      timestamp: 0,
      transactionHash: log.transactionHash,
      l2TransactionHash: receiptsMap[log.transactionHash].l2Hash,
      originChain: customClient.from.public.chain!.id,
      destinationChain: customClient.to.public.chain!.id,
      bridge: 'OP Standard Bridge',
      fees: '-',
      transactionTime: '2m',
      status: isFailed ? 'failed' : 'finalized',
      from: log.args.sender!,
      to: args.target,
      data: args.message,
      receipt: receiptsMap[log.transactionHash].receipt,
      args: args,
    };
  });

  return { accountLogs, receipts };
};

export const formatForceDepositLogs = (
  customClient: CustomClients,
  logs: GetLogsReturnType<typeof transactionDepositedABI>,
  receiptsMap: { [hash: string]: { receipt: TransactionReceipt; l2Hash: Hex } },
): { accountLogs: AccountLogs[]; receipts: TransactionReceipt[] } => {
  const receipts = logs.map(({ transactionHash }) => receiptsMap[transactionHash].receipt);

  const accountLogs: AccountLogs[] = logs.map((log) => {
    const data = opaqueDataToDepositData(log.args.opaqueData!);

    return {
      type: 'Force Tx', // Force transaction
      blockNumber: log.blockNumber,
      timestamp: 0,
      transactionHash: log.transactionHash,
      l2TransactionHash: receiptsMap[log.transactionHash].l2Hash,
      originChain: customClient.from.public.chain!.id,
      destinationChain: customClient.to.public.chain!.id,
      bridge: 'OP Standard Bridge',
      fees: '-',
      transactionTime: '1m',
      status: 'finalized',
      from: log.args.from!,
      to: log.args.to!,
      amount: 0n,
      data: data.data,
      receipt: receiptsMap[log.transactionHash].receipt,
    };
  });

  return { accountLogs, receipts };
};
