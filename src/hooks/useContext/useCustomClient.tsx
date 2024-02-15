import { useContext } from 'react';
import { CustomClientConext } from '~/providers/CustomClientProvider';

export const useCustomClient = () => {
  const context = useContext(CustomClientConext);

  if (context === undefined) {
    throw new Error('useCustomClient must be used within a StateProvider');
  }

  return context;
};
