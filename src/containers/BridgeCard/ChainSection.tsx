import { Chain } from 'viem';
import { Box, Button, SelectChangeEvent } from '@mui/material';

import BasicSelect from '~/components/Select';
import { useChain } from '~/hooks';

export const ChainSection = () => {
  const { fromList, toList, setFromChain, setToChain, fromChain, toChain, switchChains, availableChains } = useChain();

  const handleFrom = async (event: SelectChangeEvent) => {
    try {
      const chain = availableChains.find((chain) => chain.name === event.target.value) as Chain;
      setFromChain(chain);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleTo = async (event: SelectChangeEvent) => {
    setToChain(availableChains.find((chain) => chain.name === event.target.value) as Chain);
  };

  return (
    <Box>
      <BasicSelect label='From' value={fromChain} setValue={handleFrom} list={fromList} />
      <br />
      <BasicSelect label='To' value={toChain} setValue={handleTo} list={toList} />
      <Button onClick={switchChains}>Switch chains</Button>
    </Box>
  );
};
