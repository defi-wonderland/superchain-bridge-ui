import { Hex, PublicClient, TransactionReceipt, decodeEventLog, encodeFunctionData, keccak256, parseAbi } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';

import { ExecuteL1DepositProps } from '~/types';
import { depositTransactionABI, relayMessageABI } from '../parsedAbis';
import { sentMessageEvent, sentMessageExtensionEvent } from '../parsedEvents';

/**
 * Receives a L1 transaction hash and waits for the L2 transaction receipt.
 * @param l1Client {@link PublicClient}
 * @param l2Client {@link PublicClient}
 * @param l1Hash {@link Hex}
 * @returns The L2 transaction receipt.
 */
export const waitForL2TransactionReceipt = async (l1Client: PublicClient, l2Client: PublicClient, l1Hash?: Hex) => {
  if (!l1Hash) throw new Error('No hash returned');

  // Wait for the L1 transaction to be processed.
  const receipt = await l1Client.waitForTransactionReceipt({ hash: l1Hash });

  // Get the L2 transaction hash from the L1 transaction receipt.
  const [l2Hash] = getL2TransactionHashes(receipt);

  // Wait for the L2 transaction to be processed.
  const l2Receipt = await l2Client.waitForTransactionReceipt({
    hash: l2Hash,
  });

  return l2Receipt;
};

/**
 * Executes a deposit transaction on L1 and waits for the L2 transaction receipt.
 * @param customClient {@link CustomClients}
 * @param userAddress {@link Address}
 * @param to {@link Address}
 * @param args {@link ExecuteL1DepositProps}
 * @returns The L1 hash and the L2 receipt.
 */
export const excecuteL1Deposit = async ({ customClient, userAddress, to, args }: ExecuteL1DepositProps) => {
  const { request } = await customClient.from.public.simulateContract({
    account: userAddress,
    address: to,
    abi: depositTransactionABI,
    functionName: depositTransactionABI[0].name,
    args: [args.to, args.amount, args.gas, args.isCreation, args.data],
  });

  const l1Hash = await customClient.from.wallet?.writeContract(request);

  const l2Receipt: TransactionReceipt = await waitForL2TransactionReceipt(
    customClient.from.public,
    customClient.to.public,
    l1Hash,
  );

  return {
    l1Hash,
    l2Receipt,
  };
};

export const getMsgHashes = (messageReceipts: TransactionReceipt[], receiptType: 'erc20' | 'message') => {
  // if receipts are from messages:
  // - sentMessage log index = 1
  // - sentMessageExtension log index = 2

  // if receipts are from erc20 deposits:
  // - sentMessage log index = 5
  // - sentMessageExtension log index = 6

  const sentMessageLogIndex = receiptType === 'message' ? 1 : 5;
  const sentMessageExtensionLogIndex = receiptType === 'message' ? 2 : 6;

  const sentMessageDecoded = messageReceipts.map(({ logs }) =>
    decodeEventLog({
      abi: parseAbi([sentMessageEvent]),
      data: logs[sentMessageLogIndex].data,
      topics: logs[sentMessageLogIndex].topics,
    }),
  );

  const sentMessageExtensionDecoded = messageReceipts.map(({ logs }) =>
    decodeEventLog({
      abi: parseAbi([sentMessageExtensionEvent]),
      data: logs[sentMessageExtensionLogIndex].data,
      topics: logs[sentMessageExtensionLogIndex].topics,
    }),
  );

  const msgHashes = sentMessageDecoded.map(({ args }, index) =>
    keccak256(
      encodeFunctionData({
        abi: relayMessageABI,
        args: [
          args.messageNonce,
          args.sender,
          args.target,
          sentMessageExtensionDecoded[index].args.value,
          args.gasLimit,
          args.message,
        ],
      }),
    ),
  );

  return msgHashes;
};
