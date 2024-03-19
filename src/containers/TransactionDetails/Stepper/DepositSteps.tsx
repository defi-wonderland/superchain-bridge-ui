import { Step } from '~/components';
import { useLogs } from '~/hooks';

export const DepositSteps = () => {
  const { selectedLog } = useLogs();

  return (
    <>
      <Step
        title='Initiate Transaction'
        hash={selectedLog?.transactionHash || ''}
        chainId={selectedLog?.originChain}
        status='success'
      />
      <Step
        title='Finalized Transaction'
        hash={selectedLog?.l2TransactionHash}
        chainId={selectedLog?.destinationChain}
        status='final'
      />
    </>
  );
};
