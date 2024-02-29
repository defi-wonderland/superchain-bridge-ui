import { Address, TransactionReceipt } from 'viem';
import {
  FinalizeWithdrawalParameters,
  GetL2OutputParameters,
  ProveWithdrawalParameters,
  getWithdrawals,
} from 'viem/op-stack';
import { CustomClients, TransactionStep } from '~/types';

interface ProveWithdrawalProps {
  customClient: CustomClients;
  receipt: TransactionReceipt;
  userAddress: Address;
  setTxStep: (val: TransactionStep) => void;
}
export const proveWithdrawal = async ({ customClient, receipt, userAddress, setTxStep }: ProveWithdrawalProps) => {
  const [withdrawal] = getWithdrawals(receipt);

  const output = await customClient.from.public.getL2Output({
    l2BlockNumber: receipt.blockNumber,
    targetChain: customClient.to.public.chain, // L2 chain
  } as GetL2OutputParameters<typeof customClient.to.public.chain>);

  const args = await customClient.to.public.buildProveWithdrawal({
    account: userAddress,
    output,
    withdrawal,
    chain: customClient.to.public.chain,
  });

  const hash = await customClient.from.wallet?.proveWithdrawal(args as ProveWithdrawalParameters);
  setTxStep(TransactionStep.PROCESSING);

  if (!hash) throw new Error('No hash returned');

  await customClient.from.public.waitForTransactionReceipt({ hash });
  setTxStep(TransactionStep.FINALIZED);

  // temporary log
  console.log({ hash });
};

interface FinalizeWithdrawalProps {
  customClient: CustomClients;
  receipt: TransactionReceipt;
  userAddress: Address;
  setTxStep: (val: TransactionStep) => void;
}
export const finalizeWithdrawal = async ({
  customClient,
  receipt,
  userAddress,
  setTxStep,
}: FinalizeWithdrawalProps) => {
  const [withdrawal] = getWithdrawals(receipt);

  const hash = await customClient.from.wallet?.finalizeWithdrawal({
    account: userAddress,
    targetChain: customClient.to.public.chain, // L2 chain
    withdrawal,
  } as FinalizeWithdrawalParameters<typeof customClient.to.public.chain>);
  setTxStep(TransactionStep.PROCESSING);

  if (!hash) throw new Error('No hash returned');

  await customClient.from.public.waitForTransactionReceipt({ hash });
  setTxStep(TransactionStep.FINALIZED);

  // temporary log
  console.log({ hash });
};
