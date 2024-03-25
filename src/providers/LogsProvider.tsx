import { createContext, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

import CCTP from '~/data/cctp.json';
import { useCustomClient } from '~/hooks';
import { getCctpLogs, getDepositLogs, getWithdrawLogs } from '~/utils';
import { AccountLogs, CctpType, CustomClients, DepositLogs, WithdrawLogs } from '~/types';

type ContextType = {
  depositLogs?: DepositLogs;
  withdrawLogs?: WithdrawLogs;
  selectedLog?: AccountLogs;
  setSelectedLog: (log?: AccountLogs) => void;
  orderedLogs: AccountLogs[];
  setOrderedLogs: (logs: AccountLogs[]) => void;
  transactionPending: boolean;
  isSuccess: boolean;
  refetchLogs: () => void;

  cctpLogs: AccountLogs[];

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const LogsContext = createContext({} as ContextType);

export const LogsProvider = ({ children }: StateProps) => {
  const cctpData = CCTP as CctpType;
  const { address: userAddress } = useAccount();
  const { logsClient } = useCustomClient();
  const [depositLogs, setDepositLogs] = useState<DepositLogs>();
  const [withdrawLogs, setWithdrawLogs] = useState<WithdrawLogs>();
  const [selectedLog, setSelectedLog] = useState<AccountLogs>();
  const [cctpLogs, setCctpLogs] = useState<AccountLogs[]>([]);
  const [orderedLogs, setOrderedLogs] = useState<AccountLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLogs = async ({ userAddress, logsClient }: { userAddress: Address; logsClient: CustomClients }) => {
    if (userAddress) {
      //  OP Canonical bridge
      const depositLogsPromise = getDepositLogs({ userAddress, customClient: logsClient });
      const withdrawLogsPromise = getWithdrawLogs({ userAddress, customClient: logsClient });

      // Cross-Chain Transfer Protocol (CCTP)
      const cctpLogsPromise = getCctpLogs({ customClient: logsClient, userAddress, data: cctpData });

      const [depositLogs, withdrawLogs, cctpLogs] = await Promise.all([
        depositLogsPromise,
        withdrawLogsPromise,
        cctpLogsPromise,
      ]);

      setDepositLogs(depositLogs);
      setWithdrawLogs(withdrawLogs);
      setCctpLogs(cctpLogs.accountLogs);
      return true;
    }

    return false;
  };

  const { refetch, isFetched } = useQuery({
    queryKey: ['depositLogs'],
    queryFn: () => getLogs({ userAddress: userAddress!, logsClient }),
    enabled: !!userAddress,
    refetchOnWindowFocus: false, // temporary disable refetch on window focus
  });

  const refetchLogs = async () => {
    setIsLoading(true);
    setDepositLogs(undefined);
    setWithdrawLogs(undefined);
    setCctpLogs([]);
    setOrderedLogs([]);
    refetch();
  };

  const transactionPending = useMemo(() => {
    let isTransactionPending = false;
    if (depositLogs && withdrawLogs && userAddress) {
      const logs = [...depositLogs.accountLogs, ...withdrawLogs.accountLogs, ...cctpLogs];
      isTransactionPending = logs.some((log) => log.status.includes('waiting-') || log.status.includes('ready-to'));
    }

    return isTransactionPending;
  }, [cctpLogs, depositLogs, userAddress, withdrawLogs]);

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

        cctpLogs,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};
