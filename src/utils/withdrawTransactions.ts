import { Address } from 'viem';
import { InitiateERC20WithdrawProps, InitiateMessageWithdrawProps, InitiateWithdrawProps } from '~/types';
import { bridgeERC20ToABI, sendMessageABI } from './parsedAbis';

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
  selectedToken,
  amount,
  toChain,
  toTokens,
}: InitiateERC20WithdrawProps) => {
  // temporary fixed values
  const l2StandardBridge = '0x4200000000000000000000000000000000000010';
  const extraData = '0x';
  const minGasLimit = 218_874;
  const l1TokenAddress = selectedToken?.address as Address;
  const l2Token = toTokens.find((token) => token.symbol === selectedToken?.symbol && token.chainId === toChain.id);
  const l2TokenAddress = l2Token?.address as Address;

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: l2StandardBridge,
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
  const l2CrossDomainMessenger = '0x4200000000000000000000000000000000000007';
  const minGasLimit = 200_000; // TODO - get this from the contract

  const hash = await customClient.from.wallet?.writeContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: l2CrossDomainMessenger,
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
