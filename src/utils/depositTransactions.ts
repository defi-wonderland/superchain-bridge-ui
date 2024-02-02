import { Address, Chain, Hex, PublicClient } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';

import { L1CrossDomainMessengerProxy, L1StandardBridgeProxy } from './variables';
import { bridgeERC20ToABI, sendMessageABI } from './parsedAbis';
import { CustomClients, TokenData } from '~/types';

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

interface DepositETHProps {
  customClient: CustomClients;
  mint: bigint;
  to: Address;
}
export const depositETH = async ({ customClient, mint, to }: DepositETHProps) => {
  const args = await customClient.to.public.buildDepositTransaction({
    chain: undefined, // to no override the chain from the client
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

interface DepositERC20Props {
  customClient: CustomClients;
  userAddress: Address;
  toChain: Chain;
  selectedToken: TokenData;
  amount: bigint;
  toTokens: TokenData[];
  allowance: string;
  approve: () => Promise<void>;
}
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
  const l1TokenAddress = selectedToken?.address as Address;
  const extraData = '0x';
  const l2Token = toTokens.find((token) => token.symbol === selectedToken?.symbol && token.chainId === toChain.id);
  const l2TokenAddress = l2Token?.address as Address;

  // temporary fixed value
  const minGasLimit = 132303;

  const hash = await customClient.from.wallet?.writeContract({
    account: userAddress,
    address: L1StandardBridgeProxy,
    abi: bridgeERC20ToABI,
    functionName: 'bridgeERC20To',
    args: [l1TokenAddress, l2TokenAddress, userAddress!, amount, Number(minGasLimit), extraData],
    chain: undefined, // to no override the chain from the client
  });

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};

interface DepositMessageProps {
  customClient: CustomClients;
  userAddress: Address;
  data: Hex;
}
export const depositMessage = async ({ customClient, userAddress, data }: DepositMessageProps) => {
  // temporary fixed values
  const message = data as Hex;
  const minGasLimit = 200_000;

  const hash = await customClient.from.wallet?.writeContract({
    chain: undefined, // to no override the chain from the client
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
