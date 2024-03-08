import { Dispatch, SetStateAction } from 'react';
import { Address, TransactionReceipt } from 'viem';
import {
  FinalizeWithdrawalParameters,
  GetL2OutputParameters,
  ProveWithdrawalParameters,
  getWithdrawals,
} from 'viem/op-stack';
import { CustomClients, TransactionMetadata, TransactionStep } from '~/types';

interface ProveWithdrawalProps {
  customClient: CustomClients;
  receipt: TransactionReceipt;
  userAddress: Address;
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
}
export const proveWithdrawal = async ({ customClient, receipt, userAddress, setTxMetadata }: ProveWithdrawalProps) => {
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
  setTxMetadata((prev) => ({ ...prev, step: TransactionStep.PROCESSING, sourceHash: hash }));

  if (!hash) throw new Error('No hash returned');

  await customClient.from.public.waitForTransactionReceipt({ hash });
  setTxMetadata((prev) => ({ ...prev, step: TransactionStep.FINALIZED }));

  // temporary log
  console.log({ hash });
};

interface FinalizeWithdrawalProps {
  customClient: CustomClients;
  receipt: TransactionReceipt;
  userAddress: Address;
  setTxMetadata: Dispatch<SetStateAction<TransactionMetadata>>;
}
export const finalizeWithdrawal = async ({
  customClient,
  receipt,
  userAddress,
  setTxMetadata,
}: FinalizeWithdrawalProps) => {
  const [withdrawal] = getWithdrawals(receipt);

  const hash = await customClient.from.wallet?.finalizeWithdrawal({
    account: userAddress,
    targetChain: customClient.to.public.chain, // L2 chain
    withdrawal,
  } as FinalizeWithdrawalParameters<typeof customClient.to.public.chain>);
  setTxMetadata((prev) => ({ ...prev, step: TransactionStep.PROCESSING, sourceHash: hash }));

  if (!hash) throw new Error('No hash returned');

  await customClient.from.public.waitForTransactionReceipt({ hash });
  setTxMetadata((prev) => ({ ...prev, step: TransactionStep.FINALIZED }));

  // temporary log
  console.log({ hash });
};
