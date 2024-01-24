import { Button } from '@mui/material';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export const Connect = () => {
  const { open } = useWeb3Modal();

  return (
    <>
      <Button variant='outlined' onClick={() => open()}>
        Open Connect Modal
      </Button>

      <Button variant='outlined' onClick={() => open({ view: 'Networks' })}>
        Open Network Modal
      </Button>
    </>
  );
};
