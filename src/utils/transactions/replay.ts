import { Address } from 'viem';
import { CustomClients, RelayMessageArgs } from '~/types';
import { relayMessageABI } from '../parsedAbis';

interface ReplayParameters {
  customClient: CustomClients;
  userAddress: Address;
  args: RelayMessageArgs;
}
export const replayDeposit = async ({ customClient, userAddress, args }: ReplayParameters) => {
  // The gas limit is increased by 30%
  const gasLimitWithBuffer = (args.gasLimit * 130n) / 100n;

  const { request } = await customClient.from.public.simulateContract({
    account: userAddress,
    // L2 cross domain messenger for deposits
    // L1 cross domain messenger for withdrawals
    address: customClient.from.contracts.crossDomainMessenger,
    abi: relayMessageABI,
    functionName: 'relayMessage',
    args: [args.messageNonce, args.sender, args.target, args.value, gasLimitWithBuffer, args.message],
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  if (!hash) throw new Error('No hash returned');

  // Wait for the transaction to be processed.
  const receipt = await customClient.from.public.waitForTransactionReceipt({
    hash: hash,
  });

  // temporary log
  console.log(receipt);
};
