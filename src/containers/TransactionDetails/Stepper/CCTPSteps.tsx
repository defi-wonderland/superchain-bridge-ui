import { Step } from '~/components';
import { useLogs } from '~/hooks';

export const CCTPSteps = () => {
  const { selectedLog } = useLogs();

  return (
    <>
      {selectedLog?.status === 'ready-to-finalize' && (
        <>
          <Step
            title='Initiate Transaction'
            hash={selectedLog?.transactionHash || ''}
            chainId={selectedLog.originChain}
            status='success'
          />
          <Step
            title='Finalize transaction'
            status='pending'
            text='Mint the deposited USDC on the destination chain'
            connector={false}
          />
        </>
      )}
      {selectedLog?.status === 'finalized' && (
        <>
          <Step
            title='Initiate Transaction'
            hash={selectedLog?.transactionHash || ''}
            chainId={selectedLog.originChain}
            status='success'
          />
          <Step
            title='Finalize transaction'
            hash={selectedLog?.l2TransactionHash || ''}
            chainId={selectedLog.destinationChain}
            status='final'
          />
        </>
      )}
    </>
  );
};
