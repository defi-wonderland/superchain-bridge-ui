import { DepositERC20Props, DepositETHProps, DepositMessageProps } from '~/types';
import { bridgeERC20ToABI, sendMessageABI } from '../parsedAbis';
import { waitForL2TransactionReceipt } from './helpers';

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
  amount,
  allowance,
  l1TokenAddress,
  l2TokenAddress,
  approve,
}: DepositERC20Props) => {
  if (BigInt(allowance) < amount) {
    await approve();
  }

  // temporary fixed values
  const extraData = '0x';
  const minGasLimit = 132303;

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: bridgeERC20ToABI,
    functionName: 'bridgeERC20To',
    args: [l1TokenAddress, l2TokenAddress, userAddress!, amount, minGasLimit, extraData],
  });

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};

export const depositMessage = async ({ customClient, userAddress, data }: DepositMessageProps) => {
  // temporary fixed values
  const minGasLimit = 200_000;

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: sendMessageABI,
    functionName: 'sendMessage',
    args: [userAddress, data, minGasLimit],
  });

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};
