import { Address, TransactionReceipt } from 'viem';
import {
  FinalizeWithdrawalParameters,
  GetL2OutputParameters,
  GetTimeToFinalizeParameters,
  ProveWithdrawalParameters,
  getWithdrawals,
} from 'viem/op-stack';
import { CustomClients } from '~/types';

interface ProveWithdrawalProps {
  customClient: CustomClients;
  receipt: TransactionReceipt;
  userAddress: Address;
}
export const proveWithdrawal = async ({ customClient, receipt, userAddress }: ProveWithdrawalProps) => {
  const [withdrawal] = getWithdrawals(receipt);

  const output = await customClient.to.public.getL2Output({
    l2BlockNumber: receipt.blockNumber,
    targetChain: customClient.from.public.chain,
  } as GetL2OutputParameters<typeof customClient.to.public.chain>);

  const args = await customClient.to.public.buildProveWithdrawal({
    account: userAddress,
    output,
    withdrawal,
    chain: customClient.to.public.chain,
  });

  const hash = await customClient.from.wallet?.proveWithdrawal(args as ProveWithdrawalParameters);

  // getting time to finalize
  const { period, seconds, timestamp } = await customClient.from.public.getTimeToFinalize({
    chain: customClient.to.public.chain,
    withdrawalHash: withdrawal.withdrawalHash,
    targetChain: customClient.to.public.chain,
  } as GetTimeToFinalizeParameters<typeof customClient.to.public.chain>);

  // temporary log
  console.log({ hash, period, seconds, timestamp });
};

interface FinalizeWithdrawalProps {
  customClient: CustomClients;
  receipt: TransactionReceipt;
  userAddress: Address;
}
export const finalizeWithdrawal = async ({ customClient, receipt, userAddress }: FinalizeWithdrawalProps) => {
  const [withdrawal] = getWithdrawals(receipt);

  const hash = await customClient.from.wallet?.finalizeWithdrawal({
    account: userAddress,
    targetChain: customClient.to.public.chain,
    withdrawal,
  } as FinalizeWithdrawalParameters<typeof customClient.to.public.chain>);

  // temporary log
  console.log({ hash });
};
