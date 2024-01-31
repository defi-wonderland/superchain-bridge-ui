import { Chain } from 'viem';
import { Box, Button, SelectChangeEvent } from '@mui/material';

import { ChainSelect } from '~/components';
import { useChain, useToken } from '~/hooks';

export const ChainSection = () => {
  const { fromList, toList, setFromChain, setToChain, fromChain, toChain, switchChains, availableChains } = useChain();
  const { setSelectedToken } = useToken();

  const handleFrom = async (event: SelectChangeEvent) => {
    try {
      const chain = availableChains.find((chain) => chain.name === event.target.value) as Chain;
      setFromChain(chain);

      // Reset token when chain is changed
      setSelectedToken(undefined);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleTo = async (event: SelectChangeEvent) => {
    setToChain(availableChains.find((chain) => chain.name === event.target.value) as Chain);
  };

  return (
    <Box>
      <ChainSelect label='From' value={fromChain} setValue={handleFrom} list={fromList} />
      <br />
      <ChainSelect label='To' value={toChain} setValue={handleTo} list={toList} />
      <Button onClick={switchChains}>Switch chains</Button>
    </Box>
  );
};
