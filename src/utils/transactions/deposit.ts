import { DepositERC20Props, DepositETHProps, DepositMessageProps } from '~/types';
import { bridgeERC20ToABI, bridgeETHToABI, sendMessageABI } from '../parsedAbis';
import { waitForL2TransactionReceipt } from './helpers';

export const depositETH = async ({ customClient, userAddress, mint, to }: DepositETHProps) => {
  // temporary fixed values
  const extraData = '0x';
  const minGasLimit = 132303;

  const { request } = await customClient.from.public.simulateContract({
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: bridgeETHToABI,
    functionName: bridgeETHToABI[0].name,
    args: [to, minGasLimit, extraData],
    value: mint,
  });

  const hash = await customClient.from.wallet?.writeContract(request);

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

  const { request } = await customClient.from.public.simulateContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: bridgeERC20ToABI,
    functionName: bridgeERC20ToABI[0].name,
    args: [l1TokenAddress, l2TokenAddress, userAddress!, amount, minGasLimit, extraData],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};

export const depositMessage = async ({ customClient, userAddress, data }: DepositMessageProps) => {
  // temporary fixed values
  const minGasLimit = 200_000;

  const { request } = await customClient.from.public.simulateContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: sendMessageABI,
    functionName: sendMessageABI[0].name,
    args: [userAddress, data, minGasLimit],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};
