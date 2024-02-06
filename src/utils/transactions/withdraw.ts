import { InitiateERC20WithdrawProps, InitiateMessageWithdrawProps, InitiateWithdrawProps } from '~/types';
import { bridgeERC20ToABI, sendMessageABI } from '../parsedAbis';

export const initiateETHWithdraw = async ({ customClient, userAddress, mint, to }: InitiateWithdrawProps) => {
  const args = await customClient.to.public.buildInitiateWithdrawal({
    chain: customClient.to.public.chain,
    account: userAddress,
    to: to,
    value: mint,
  });

  // Execute the initiate withdrawal transaction on the L2.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hash = await customClient.from.wallet?.initiateWithdrawal(args as any);

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

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.standardBridge,
    abi: bridgeERC20ToABI,
    functionName: 'bridgeERC20To',
    args: [l1TokenAddress, l2TokenAddress, userAddress!, amount, minGasLimit, extraData],
  });

  if (!hash) throw new Error('No hash returned');

  // Wait for the initiate withdrawal transaction receipt.
  const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

  // temporary log
  console.log(receipt);
};

export const initiateMessageWithdraw = async ({ customClient, userAddress, message }: InitiateMessageWithdrawProps) => {
  // temporary fixed values
  const minGasLimit = 200_000; // TODO - get this from the contract

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.crossDomainMessenger,
    abi: sendMessageABI,
    functionName: 'sendMessage',
    args: [userAddress, message, minGasLimit],
  });

  if (!hash) throw new Error('No hash returned');

  // Wait for the initiate withdrawal transaction receipt.
  const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

  // temporary log
  console.log(receipt);
};
