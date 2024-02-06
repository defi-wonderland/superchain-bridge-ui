import { encodeFunctionData, parseAbi } from 'viem';

import { finalizeBridgeERC20ABI, finalizeBridgeETHABI, withdrawToABI } from '../parsedAbis';
import {
  ForceErc20TransferProps,
  ForceErc20WithdrawalProps,
  ForceEthTransferProps,
  ForceEthWithdrawalProps,
} from '~/types';
import { excecuteL1Deposit } from './helpers';

export const forceEthTransfer = async ({ customClient, amount, to, userAddress }: ForceEthTransferProps) => {
  // temporary fixed values
  const gas = 40_000n;
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

  const result = await excecuteL1Deposit({
    customClient,
    userAddress,
    to: customClient.from.contracts.portal!, //portal,
    args: {
      amount,
      to,
      gas,
      isCreation,
      data,
    },
  });

  // temporary log
  console.log(result);
};

export const forceErc20Transfer = async ({
  customClient,
  amount,
  to,
  userAddress,
  tokenAddress,
}: ForceErc20TransferProps) => {
  // temporary fixed values
  const gas = 40_000n;
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

  const result = await excecuteL1Deposit({
    customClient,
    userAddress,
    to: customClient.from.contracts.portal!, //portal,
    args: {
      amount,
      to: tokenAddress,
      gas,
      isCreation,
      data,
    },
  });

  // temporary log
  console.log(result);
};

export const forceEthWithdrawal = async ({ customClient, userAddress, to, amount }: ForceEthWithdrawalProps) => {
  // temporary fixed values
  const extraData = '0x';
  const ethAddressOnBridge = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000'; // optimism sepolia
  const isCreation = false;

  const finalizeBridgeETHData = encodeFunctionData({
    abi: finalizeBridgeETHABI,
    args: [userAddress, to, amount, extraData],
  });

  const finalizeBridgeEthGas = await customClient.from.public.estimateGas({
    account: customClient.from.contracts.crossDomainMessenger, //l1CrossDomainMessenger,
    to: customClient.from.contracts.standardBridge, //l1StandardBridge,
    data: finalizeBridgeETHData,
  });

  const withdrawToData = encodeFunctionData({
    abi: withdrawToABI,
    args: [ethAddressOnBridge, to, amount, Number(finalizeBridgeEthGas), extraData],
  });

  const withdrawToGas = await customClient.to.public.estimateGas({
    account: userAddress,
    to: customClient.to.contracts.standardBridge, //l2StandardBridge,
    data: withdrawToData,
  });

  const result = await excecuteL1Deposit({
    customClient,
    userAddress,
    to: customClient.from.contracts.portal!, // portal
    args: {
      amount,
      to: customClient.to.contracts.standardBridge, //l2StandardBridge,
      gas: withdrawToGas,
      isCreation,
      data: withdrawToData,
    },
  });

  // temporary log
  console.log(result);
};

export const forceErc20Withdrawal = async ({
  customClient,
  userAddress,
  to,
  amount,
  l1TokenAddress,
  l2TokenAddress,
}: ForceErc20WithdrawalProps) => {
  // temporary fixed values
  const extraData = '0x';
  const ethAddressOnBridge = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000'; // optimism sepolia
  const isCreation = false;

  const finalizeBridgeERC20Data = encodeFunctionData({
    abi: finalizeBridgeERC20ABI,
    args: [l1TokenAddress, l2TokenAddress, userAddress, to, amount, extraData],
  });

  const finalizeBridgeERC20Gas = await customClient.from.public.estimateGas({
    account: customClient.from.contracts.crossDomainMessenger, //l1CrossDomainMessenger,
    to: customClient.from.contracts.standardBridge, //l1StandardBridge,
    data: finalizeBridgeERC20Data,
  });

  const withdrawToData = encodeFunctionData({
    abi: withdrawToABI,
    args: [ethAddressOnBridge, to, amount, Number(finalizeBridgeERC20Gas), extraData],
  });

  const withdrawToGas = await customClient.to.public.estimateGas({
    account: userAddress,
    to: customClient.to.contracts.standardBridge, // l2StandardBridge,
    data: withdrawToData,
  });

  const result = await excecuteL1Deposit({
    customClient,
    userAddress,
    to: customClient.from.contracts.portal!, //portal,
    args: {
      amount,
      to: customClient.to.contracts.standardBridge, //l2StandardBridge,
      gas: withdrawToGas,
      isCreation,
      data: withdrawToData,
    },
  });

  // temporary log
  console.log(result);
};
