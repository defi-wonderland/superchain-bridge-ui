import { Address, encodeFunctionData, parseAbi } from 'viem';

import { waitForL2TransactionReceipt } from './deposit';
import { depositTransactionABI, finalizeBridgeETHABI, withdrawToABI } from '../parsedAbis';
import { CustomClients } from '~/types';

interface ForceEthTransferProps {
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
}

export const forceEthTransfer = async ({ customClient, amount, to, userAddress }: ForceEthTransferProps) => {
  // temporary fixed values
  const gas = 40_000n;
  const portal = '0x16Fc5058F25648194471939df75CF27A2fdC48BC';
  const isCreation = false;

  const data = encodeFunctionData({
    abi: parseAbi(['function transfer(uint256 _amount) external']),
    args: [amount],
  });

  // TODO: check why it fails with the calculated estimateGas value
  //   const gas = await customClient.to.public.estimateGas({
  //     account: userAddress,
  //     to,
  //     data,
  //   });

  const { request } = await customClient.from.public.simulateContract({
    account: userAddress,
    address: portal,
    abi: depositTransactionABI,
    functionName: 'depositTransaction',
    args: [to, amount, gas, isCreation, data],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};

interface ForceErc20TransferProps {
  customClient: CustomClients;
  amount: bigint;
  to: Address;
  userAddress: Address;
  tokenAddress: Address;
}
export const forceErc20Transfer = async ({
  customClient,
  amount,
  to,
  userAddress,
  tokenAddress,
}: ForceErc20TransferProps) => {
  console.log({ amount });
  // temporary fixed values
  const gas = 40_000n;
  const portal = '0x16Fc5058F25648194471939df75CF27A2fdC48BC';
  const isCreation = false;

  const data = encodeFunctionData({
    abi: parseAbi(['function transfer(address _recipient, uint256 _amount) external']),
    args: [to, amount],
  });

  // TODO: check why it fails with the calculated estimateGas value
  //   const gas = await customClient.to.public.estimateGas({
  //     account: userAddress,
  //     tokenAddress,
  //     data,
  //   });

  const { request } = await customClient.from.public.simulateContract({
    account: userAddress,
    address: portal,
    abi: depositTransactionABI,
    functionName: 'depositTransaction',
    args: [tokenAddress, amount, gas, isCreation, data],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};

interface ForceEthWithdrawalProps {
  customClient: CustomClients;
  userAddress: Address;
  to: Address;
  amount: bigint;
}
export const forceEthWithdrawal = async ({ customClient, userAddress, to, amount }: ForceEthWithdrawalProps) => {
  // temporary fixed values
  const extraData = '0x';
  const l1CrossDomainMessenger = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'; // sepolia
  const l1StandardBridge = '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'; // sepolia
  const ethAddressOnBridge = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000'; // on l2, optimism sepolia
  const l2StandardBridge = '0x4200000000000000000000000000000000000010'; // optimism sepolia
  const portal = '0x16Fc5058F25648194471939df75CF27A2fdC48BC'; // sepolia
  const isCreation = false;

  const finalizeBridgeETHData = encodeFunctionData({
    abi: finalizeBridgeETHABI,
    args: [userAddress, to, amount, extraData],
  });

  const finalizeBridgeEthGas = await customClient.to.public.estimateGas({
    account: l1CrossDomainMessenger,
    to: l1StandardBridge,
    data: finalizeBridgeETHData,
  });

  const withdrawToData = encodeFunctionData({
    abi: withdrawToABI,
    args: [ethAddressOnBridge, to, amount, Number(finalizeBridgeEthGas), extraData],
  });

  const withdrawToGas = await customClient.to.public.estimateGas({
    account: userAddress,
    to: l2StandardBridge,
    data: withdrawToData,
  });

  const { request } = await customClient.from.public.simulateContract({
    account: userAddress,
    address: portal,
    abi: depositTransactionABI,
    functionName: 'depositTransaction',
    args: [l2StandardBridge, amount, withdrawToGas, isCreation, withdrawToData],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

  // temporary log
  console.log(l2Receipt);
};
