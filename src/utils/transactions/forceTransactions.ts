import { encodeFunctionData, parseAbi } from 'viem';

import { bridgeERC20ToABI, withdrawToABI } from '../parsedAbis';
import {
  ForceErc20TransferProps,
  ForceErc20WithdrawalProps,
  ForceEthTransferProps,
  ForceEthWithdrawalProps,
} from '~/types';
import { excecuteL1Deposit } from './helpers';

export const forceEthTransfer = async ({
  customClient,
  amount,
  to,
  userAddress,
  setTxMetadata,
}: ForceEthTransferProps) => {
  // temporary fixed values
  const gas = 100_000n;
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
    setTxMetadata,
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
  setTxMetadata,
}: ForceErc20TransferProps) => {
  // temporary fixed values
  const gas = 100_000n;
  const isCreation = false;

  const data = encodeFunctionData({
    abi: parseAbi(['function transfer(address _recipient, uint256 _amount) external']),
    args: [to, amount],
  });

  // TODO: check why it fails with the calculated estimateGas value
  // const gas = await customClient.to.public.estimateGas({
  //   account: userAddress,
  //   to: tokenAddress,
  //   data,
  // });

  const result = await excecuteL1Deposit({
    setTxMetadata,
    customClient,
    userAddress,
    to: customClient.from.contracts.portal!, //portal,
    args: {
      amount: 0n,
      to: tokenAddress,
      gas,
      isCreation,
      data,
    },
  });

  // temporary log
  console.log(result);
};

export const forceEthWithdrawal = async ({
  customClient,
  userAddress,
  to,
  amount,
  setTxMetadata,
}: ForceEthWithdrawalProps) => {
  // temporary fixed values
  const extraData = '0x';
  const ethAddressOnBridge = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000'; // optimism sepolia
  const isCreation = false;
  const finalizeBridgeEthGas = 200_000n;

  // const finalizeBridgeETHData = encodeFunctionData({
  //   abi: finalizeBridgeETHABI,
  //   args: [userAddress, to, amount, extraData],
  // });

  // const finalizeBridgeEthGas = await customClient.to.public.simulateContract({
  //   account: customClient.to.contracts.crossDomainMessenger, //l1CrossDomainMessenger,
  //   address: customClient.to.contracts.standardBridge, //l1StandardBridge,
  //   abi: finalizeBridgeETHABI,
  //   functionName: 'finalizeBridgeETH',
  //   args: [userAddress, to, amount, extraData],
  // });

  const withdrawToData = encodeFunctionData({
    abi: withdrawToABI,
    args: [ethAddressOnBridge, to, amount, Number(finalizeBridgeEthGas), extraData],
  });

  const withdrawToGas = await customClient.to.public.estimateGas({
    account: userAddress,
    to: customClient.to.contracts.standardBridge, //l2StandardBridge,
    data: withdrawToData,
    value: amount,
  });

  const result = await excecuteL1Deposit({
    setTxMetadata,
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
  setTxMetadata,
}: ForceErc20WithdrawalProps) => {
  // temporary fixed values
  const extraData = '0x';
  const isCreation = false;
  const finalizeBridgeERC20Gas = 200_000n;

  // const finalizeBridgeERC20Data = encodeFunctionData({
  //   abi: finalizeBridgeERC20ABI,
  //   args: [l1TokenAddress, l2TokenAddress, userAddress, to, amount, extraData],
  // });

  // const finalizeBridgeERC20Gas = await customClient.to.public.estimateGas({
  //   account: customClient.to.contracts.crossDomainMessenger, //l1CrossDomainMessenger,
  //   to: customClient.to.contracts.standardBridge, //l1StandardBridge,
  //   data: finalizeBridgeERC20Data,
  // });

  const bridgeERC20ToData = encodeFunctionData({
    abi: bridgeERC20ToABI,
    args: [l2TokenAddress, l1TokenAddress, to, amount, Number(finalizeBridgeERC20Gas), extraData],
  });

  const bridgeERC20ToGas = await customClient.to.public.estimateGas({
    account: userAddress,
    to: customClient.to.contracts.standardBridge, // l2StandardBridge,
    data: bridgeERC20ToData,
  });

  const result = await excecuteL1Deposit({
    setTxMetadata,
    customClient,
    userAddress,
    to: customClient.from.contracts.portal!, //portal,
    args: {
      amount: 0n,
      to: customClient.to.contracts.standardBridge, //l2StandardBridge,
      gas: bridgeERC20ToGas,
      isCreation,
      data: bridgeERC20ToData,
    },
  });

  // temporary log
  console.log(result);
};
