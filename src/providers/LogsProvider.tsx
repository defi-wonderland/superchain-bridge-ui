import { createContext, useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useCustomClient } from '~/hooks';
import { getDepositLogs, getWithdrawLogs } from '~/utils';
import { AccountLogs, DepositLogs, WithdrawLogs } from '~/types';

type ContextType = {
  depositLogs?: DepositLogs;
  withdrawLogs?: WithdrawLogs;
  selectedLog?: AccountLogs;
  setSelectedLog: (log: AccountLogs) => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const LogsContext = createContext({} as ContextType);

export const LogsProvider = ({ children }: StateProps) => {
  const { address: userAddress } = useAccount();
  const { customClient } = useCustomClient();
  const [depositLogs, setDepositLogs] = useState<DepositLogs>();
  const [withdrawLogs, setWithdrawLogs] = useState<WithdrawLogs>();
  const [selectedLog, setSelectedLog] = useState<AccountLogs>();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['depositLogs'],
        queryFn: () => getDepositLogs({ userAddress, customClient }),
        enabled: !!userAddress,
        refetchOnWindowFocus: false, // temporary disable refetch on window focus
      },
      {
        queryKey: ['withdrawLogs'],
        queryFn: () => getWithdrawLogs({ userAddress, customClient }),
        enabled: !!userAddress,
        refetchOnWindowFocus: false, // temporary disable refetch on window focus
      },
    ],
  });

  useEffect(() => {
    if (queries[0]) {
      setDepositLogs(queries[0].data);
    }
    if (queries[1]) {
      setWithdrawLogs(queries[1].data);
    }
  }, [queries]);

  return (
    <LogsContext.Provider
      value={{
        depositLogs,
        withdrawLogs,
        selectedLog,
        setSelectedLog,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};
