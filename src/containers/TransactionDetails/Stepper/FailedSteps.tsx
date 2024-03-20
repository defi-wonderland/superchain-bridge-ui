import { Step } from '~/components';
import { useLogs } from '~/hooks';

export const FailedSteps = () => {
  const { selectedLog } = useLogs();

  return (
    <>
      <Step
        title='Initiate Transaction'
        hash={selectedLog?.transactionHash || ''}
        chainId={selectedLog?.originChain}
        status='success'
      />
      <Step title='Replay Transaction' status='idle' connector={false} />
    </>
  );
};
