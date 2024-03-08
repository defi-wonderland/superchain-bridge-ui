import { Dispatch, SetStateAction } from 'react';
import { Hex, PublicClient, TransactionReceipt, decodeEventLog, encodeFunctionData, keccak256, parseAbi } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';

import { ExecuteL1DepositProps, TransactionMetadata, TransactionStep } from '~/types';
import { depositTransactionABI, relayMessageABI } from '../parsedAbis';
import { sentMessageEvent, sentMessageExtensionEvent } from '../parsedEvents';

/**
 * Receives a L1 transaction hash and waits for the L2 transaction receipt.
 * @param l1Client {@link PublicClient}
 * @param l2Client {@link PublicClient}
 * @param l1Hash {@link Hex}
 * @returns The L2 transaction receipt.
 */
export const waitForL2TransactionReceipt = async (
  l1Client: PublicClient,
  l2Client: PublicClient,
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>,
  l1Hash?: Hex,
) => {
  if (!l1Hash) throw new Error('No hash returned');

  setTxMetadata((prev) => ({ ...prev, step: TransactionStep.PROCESSING, sourceHash: l1Hash }));

  // Wait for the L1 transaction to be processed.
  const receipt = await l1Client.waitForTransactionReceipt({ hash: l1Hash });

  // Get the L2 transaction hash from the L1 transaction receipt.
  const [l2Hash] = getL2TransactionHashes(receipt);

  setTxMetadata((prev) => ({ ...prev, step: TransactionStep.REPLAYING, destinationHash: l2Hash }));

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
export const excecuteL1Deposit = async ({
  customClient,
  userAddress,
  to,
  args,
  setTxMetadata,
}: ExecuteL1DepositProps) => {
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
    setTxMetadata,
    l1Hash,
  );

  return {
    l1Hash,
    l2Receipt,
  };
};

export const getMsgHashes = (messageReceipts: TransactionReceipt[], receiptType: 'erc20' | 'message' | 'eth') => {
  const sentMessageLogIndex = getSenMessageLogIndex(receiptType);
  const sentMessageExtensionLogIndex = getSentMessageExtensionLogIndex(receiptType);

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

  const args = sentMessageDecoded.map(({ args }, index) => ({
    messageNonce: args.messageNonce,
    sender: args.sender,
    target: args.target,
    value: sentMessageExtensionDecoded[index].args.value,
    gasLimit: args.gasLimit,
    message: args.message,
  }));

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

  return { msgHashes, args };
};

const getSenMessageLogIndex = (receiptType: 'erc20' | 'message' | 'eth') => {
  // if receipts are from messages:
  // - sentMessage log index = 1

  // if receipts are from erc20 transactions:
  // - sentMessage log index = 5

  // if receipts are from eth transactions:
  // - sentMessage log index = 3

  if (receiptType === 'message') return 1;
  if (receiptType === 'erc20') return 5;
  return 3;
};

const getSentMessageExtensionLogIndex = (receiptType: 'erc20' | 'message' | 'eth') => {
  // if receipts are from messages:
  // - sentMessageExtension1 log index = 2

  // if receipts are from erc20 transactions:
  // - sentMessageExtension1 log index = 6

  // if receipts are from eth transactions:
  // - sentMessageExtension1 log index = 4

  if (receiptType === 'message') return 2;
  if (receiptType === 'erc20') return 6;
  return 4;
};
