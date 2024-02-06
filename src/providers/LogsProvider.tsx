import { createContext, useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { GetLogsReturnType } from 'viem';
import { useAccount } from 'wagmi';

import { messagePassedAbi, transactionDepositedABI } from '~/utils';
import { useCustomClient } from '~/hooks';

type ContextType = {
  depositLogs?: GetLogsReturnType<typeof transactionDepositedABI>;
  withdrawLogs?: GetLogsReturnType<typeof messagePassedAbi>;
};

interface StateProps {
  children: React.ReactElement;
}

export const LogsContext = createContext({} as ContextType);

export const LogsProvider = ({ children }: StateProps) => {
  const { address: userAddress } = useAccount();
  const { customClient } = useCustomClient();
  const [depositLogs, setDepositLogs] = useState<GetLogsReturnType<typeof transactionDepositedABI>>();
  const [withdrawLogs, setWithdrawLogs] = useState<GetLogsReturnType<typeof messagePassedAbi>>();

  const getDepositLogs = async () => {
    // temporary fixed address
    const portal = '0x16Fc5058F25648194471939df75CF27A2fdC48BC';

    const logs = await customClient.from.public.getLogs({
      address: portal,
      event: transactionDepositedABI,
      args: {
        from: userAddress,
      },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });
    return logs;
  };

  const getWithdrawLogs = async () => {
    // temporary fixed address
    const l2ToL1MessagePasser = '0x4200000000000000000000000000000000000016';

    const logs = await customClient.to.public.getLogs({
      address: l2ToL1MessagePasser,
      event: messagePassedAbi,
      args: {
        sender: userAddress,
      },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });
    return logs;
  };

  const queries = useQueries({
    queries: [
      {
        queryKey: ['depositLogs'],
        queryFn: getDepositLogs,
        enabled: !!userAddress,
        refetchOnWindowFocus: false, // temporary disable refetch on window focus
      },
      {
        queryKey: ['withdrawLogs'],
        queryFn: getWithdrawLogs,
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
