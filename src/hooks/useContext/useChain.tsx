import { useContext } from 'react';
import { ChainContext } from '~/providers/ChainProvider';

export const useChain = () => {
  const context = useContext(ChainContext);

  if (context === undefined) {
    throw new Error('useChain must be used within a StateProvider');
  }

  return context;
};
