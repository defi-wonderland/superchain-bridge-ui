import { useContext } from 'react';
import { LogsContext } from '~/providers/LogsProvider';

export const useLogs = () => {
  const context = useContext(LogsContext);

  if (context === undefined) {
    throw new Error('useLogs must be used within a StateProvider');
  }

  return context;
};
