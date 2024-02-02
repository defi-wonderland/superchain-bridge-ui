import { Address, Hex, PublicClient } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';

import { DepositERC20Props, DepositETHProps, DepositMessageProps } from '~/types';
import { L1CrossDomainMessengerProxy, L1StandardBridgeProxy } from './variables';
import { bridgeERC20ToABI, sendMessageABI } from './parsedAbis';

const waitForL2TransactionReceipt = async (l1Client: PublicClient, l2Client: PublicClient, l1Hash?: Hex) => {
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

export const depositETH = async ({ customClient, mint, to }: DepositETHProps) => {
  const args = await customClient.to.public.buildDepositTransaction({
    chain: customClient.to.public.chain,
    to,
    mint,
  });

  // temporary any, typings from viem are kinda broken
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hash = await customClient.from.wallet?.depositTransaction(args as any);

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};

export const depositERC20 = async ({
  customClient,
  userAddress,
  toChain,
  selectedToken,
  amount,
  allowance,
  toTokens,
  approve,
}: DepositERC20Props) => {
  if (BigInt(allowance) < amount) {
    await approve();
  }

  // temporary fixed values
  const l1TokenAddress = selectedToken?.address as Address;
  const extraData = '0x';
  const l2Token = toTokens.find((token) => token.symbol === selectedToken?.symbol && token.chainId === toChain.id);
  const l2TokenAddress = l2Token?.address as Address;
  const minGasLimit = 132303;

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: L1StandardBridgeProxy,
    abi: bridgeERC20ToABI,
    functionName: 'bridgeERC20To',
    args: [l1TokenAddress, l2TokenAddress, userAddress!, amount, Number(minGasLimit), extraData],
  });

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};

export const depositMessage = async ({ customClient, userAddress, data }: DepositMessageProps) => {
  // temporary fixed values
  const message = data as Hex;
  const minGasLimit = 200_000;

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: L1CrossDomainMessengerProxy,
    abi: sendMessageABI,
    functionName: 'sendMessage',
    args: [userAddress, message, minGasLimit],
  });

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};
