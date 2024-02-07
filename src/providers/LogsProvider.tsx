import { createContext, useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { GetLogsReturnType, TransactionReceipt } from 'viem';
import { GetWithdrawalStatusReturnType } from 'viem/op-stack';
import { useAccount } from 'wagmi';

import { messagePassedAbi, transactionDepositedABI } from '~/utils';
import { useCustomClient } from '~/hooks';
import { getDepositLogs, getWithdrawLogs } from '~/utils/transactions/logs';

type DepositLogs = { logs: GetLogsReturnType<typeof transactionDepositedABI>; receipts: TransactionReceipt[] };
type WithdrawLogs = {
  logs: GetLogsReturnType<typeof messagePassedAbi>;
  receipts: TransactionReceipt[];
  status: GetWithdrawalStatusReturnType[];
};

type ContextType = {
  depositLogs?: DepositLogs;
  withdrawLogs?: WithdrawLogs;
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
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};
