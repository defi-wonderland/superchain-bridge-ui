import { Address, encodeFunctionData, parseAbi } from 'viem';

import { waitForL2TransactionReceipt } from './deposit';
import { depositTransactionABI } from '../parsedAbis';
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

  const { request } = await customClient.to.public.simulateContract({
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
