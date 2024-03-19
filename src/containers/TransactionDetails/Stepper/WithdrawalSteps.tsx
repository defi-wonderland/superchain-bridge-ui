import { Step } from '~/components';
import { useLogs } from '~/hooks';

export const WithdrawalSteps = () => {
  const { selectedLog } = useLogs();
  return (
    <>
      {selectedLog?.status === 'waiting-to-prove' && (
        <>
          <Step
            title='Initiate Transaction'
            hash={selectedLog?.transactionHash || ''}
            chainId={selectedLog.originChain}
            status='success'
          />
          <Step title='Wait to Prove' text='Wait up to 5 minutes' status='loading' />
          <Step title='Prove Withdrawal' status='idle' />
          <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='idle' />
          <Step title='Finalize Withdrawal' status='idle' connector={false} />
        </>
      )}
      {selectedLog?.status === 'ready-to-prove' && (
        <>
          <Step
            title='Initiate Transaction'
            hash={selectedLog?.transactionHash || ''}
            chainId={selectedLog.originChain}
            status='success'
          />
          <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
          <Step title='Prove Withdrawal' status='pending' />
          <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='idle' />
          <Step title='Finalize Withdrawal' status='idle' connector={false} />
        </>
      )}
      {selectedLog?.status === 'waiting-to-finalize' && (
        <>
          <Step
            title='Initiate Transaction'
            hash={selectedLog?.transactionHash || ''}
            chainId={selectedLog.originChain}
            status='success'
          />
          <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
          <Step title='Prove Withdrawal' status='success' />
          <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='loading' />
          <Step title='Finalize Withdrawal' status='idle' connector={false} />
        </>
      )}
      {selectedLog?.status === 'ready-to-finalize' && (
        <>
          <Step
            title='Initiate Transaction'
            hash={selectedLog?.transactionHash || ''}
            chainId={selectedLog.originChain}
            status='success'
          />
          <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
          <Step title='Prove Withdrawal' status='success' />
          <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='success' />
          <Step title='Finalize Withdrawal' status='pending' connector={false} />
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
          <Step title='Wait to Prove' text='Wait up to 5 minutes' status='success' />
          <Step title='Prove Withdrawal' status='success' />
          <Step title='Wait 7 days' text='Wait up to 5 minutes if you are on a Tesnet' status='success' />
          <Step title='Finalize Withdrawal' status='final' />
        </>
      )}
    </>
  );
};
