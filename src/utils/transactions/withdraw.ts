import { InitiateERC20WithdrawProps, InitiateMessageWithdrawProps, InitiateWithdrawProps } from '~/types';
import { bridgeERC20ToABI, bridgeETHToABI, sendMessageABI } from '../parsedAbis';

export const initiateETHWithdraw = async ({ customClient, userAddress, mint, to }: InitiateWithdrawProps) => {
  // temporary fixed values
  const extraData = '0x';
  const minGasLimit = 218_874;

  const { request } = await customClient.from.public.simulateContract({
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: bridgeETHToABI,
    functionName: bridgeETHToABI[0].name,
    args: [to, minGasLimit, extraData],
    value: mint,
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  if (!hash) throw new Error('No hash returned');

  // Wait for the initiate withdrawal transaction receipt.
  const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

  // temporary log
  console.log(receipt);
};

export const initiateERC20Withdraw = async ({
  customClient,
  userAddress,
  amount,
  l1TokenAddress,
  l2TokenAddress,
}: InitiateERC20WithdrawProps) => {
  // temporary fixed values
  const extraData = '0x';
  const minGasLimit = 218_874;

  const { request } = await customClient.from.public.simulateContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: bridgeERC20ToABI,
    functionName: bridgeERC20ToABI[0].name,
    args: [l1TokenAddress, l2TokenAddress, userAddress!, amount, minGasLimit, extraData],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  if (!hash) throw new Error('No hash returned');

  // Wait for the initiate withdrawal transaction receipt.
  const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

  // temporary log
  console.log(receipt);
};

export const initiateMessageWithdraw = async ({ customClient, userAddress, message }: InitiateMessageWithdrawProps) => {
  // temporary fixed values
  const minGasLimit = 200_000; // TODO - get this from the contract

  const { request } = await customClient.from.public.simulateContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.crossDomainMessenger,
    abi: sendMessageABI,
    functionName: 'sendMessage',
    args: [userAddress, message, minGasLimit],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  if (!hash) throw new Error('No hash returned');

  // Wait for the initiate withdrawal transaction receipt.
  const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

  // temporary log
  console.log(receipt);
};
