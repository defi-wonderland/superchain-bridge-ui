import { DepositERC20Props, DepositETHProps, DepositMessageProps, TransactionStep } from '~/types';
import { bridgeERC20ToABI, bridgeETHToABI, sendMessageABI } from '../parsedAbis';
import { waitForL2TransactionReceipt } from './helpers';

export const depositETH = async ({ customClient, userAddress, mint, to, setTxMetadata }: DepositETHProps) => {
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

  setTxMetadata((prev) => ({ ...prev, step: TransactionStep.PROCESSING, sourceHash: hash }));

  const l2Receipt = await waitForL2TransactionReceipt(
    customClient.from.public,
    customClient.to.public,
    setTxMetadata,
    hash,
  );

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
  setTxMetadata,
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

  const l2Receipt = await waitForL2TransactionReceipt(
    customClient.from.public,
    customClient.to.public,
    setTxMetadata,
    hash,
  );

  // temporary log
  console.log(l2Receipt);
};

export const depositMessage = async ({
  customClient,
  userAddress,
  target,
  data,
  setTxMetadata,
}: DepositMessageProps) => {
  // temporary fixed values
  const minGasLimit = 200_000;

  const { request } = await customClient.from.public.simulateContract({
    chain: customClient.from.public.chain,
    account: userAddress,
    address: customClient.from.contracts.crossDomainMessenger,
    abi: sendMessageABI,
    functionName: sendMessageABI[0].name,
    args: [target, data, minGasLimit],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  const l2Receipt = await waitForL2TransactionReceipt(
    customClient.from.public,
    customClient.to.public,
    setTxMetadata,
    hash,
  );

  // temporary log
  console.log(l2Receipt);
};

// This is a test function that simulates a failed deposit transaction, it will not used in the application
// it'll be removed in the future
// export const testDepositFailedTransaction = async ({ customClient, userAddress }: DepositMessageProps) => {
//   const target = '0xEF60cF6C6D0C1c755be104843bb72CDa3D778630';
//   const data =
//     '0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000774657374696e6700000000000000000000000000000000000000000000000000';

//   await depositMessage({ customClient, userAddress, target, data });
// };
