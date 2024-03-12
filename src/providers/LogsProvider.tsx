import { createContext, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

import { useCustomClient } from '~/hooks';
import { getDepositLogs, getWithdrawLogs } from '~/utils';
import { AccountLogs, CustomClients, DepositLogs, WithdrawLogs } from '~/types';

type ContextType = {
  depositLogs?: DepositLogs;
  withdrawLogs?: WithdrawLogs;
  selectedLog?: AccountLogs;
  setSelectedLog: (log: AccountLogs) => void;
  orderedLogs: AccountLogs[];
  setOrderedLogs: (logs: AccountLogs[]) => void;
  transactionPending: boolean;
  isSuccess: boolean;
  refetchLogs: () => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
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
  const [orderedLogs, setOrderedLogs] = useState<AccountLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLogs = async ({ userAddress, customClient }: { userAddress: Address; customClient: CustomClients }) => {
    if (userAddress) {
      const depositLogs = await getDepositLogs({ userAddress, customClient });
      const withdrawLogs = await getWithdrawLogs({ userAddress, customClient });

      setDepositLogs(depositLogs);
      setWithdrawLogs(withdrawLogs);
      return true;
    }
    return false;
  };

  const { refetch, isFetched } = useQuery({
    queryKey: ['depositLogs'],
    queryFn: () => getLogs({ userAddress: userAddress!, customClient }),
    enabled: !!userAddress,
    refetchOnWindowFocus: false, // temporary disable refetch on window focus
  });

  const refetchLogs = async () => {
    setIsLoading(true);
    setDepositLogs(undefined);
    setWithdrawLogs(undefined);
    setOrderedLogs([]);
    refetch();
  };

  const transactionPending = useMemo(() => {
    let isTransactionPending = false;
    if (depositLogs && withdrawLogs && userAddress) {
      const logs = [...depositLogs.accountLogs, ...withdrawLogs.accountLogs];
      isTransactionPending = logs.some((log) => log.status.includes('waiting-') || log.status.includes('ready-to'));
    }

    return isTransactionPending;
  }, [depositLogs, userAddress, withdrawLogs]);

  const isSuccess = useMemo(() => {
    return isFetched;
  }, [isFetched]);

  return (
    <LogsContext.Provider
      value={{
        depositLogs,
        withdrawLogs,
        selectedLog,
        setSelectedLog,
        orderedLogs,
        setOrderedLogs,
        transactionPending,
        isSuccess,
        isLoading,
        setIsLoading,
        refetchLogs,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};
