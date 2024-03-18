import { useCallback } from 'react';

import { useCustomClient, useLogs, useTransactionData } from '~/hooks';
import { replayDeposit } from '~/utils';

export const useReplay = () => {
  const { userAddress } = useTransactionData();
  const { customClient } = useCustomClient();
  const { selectedLog } = useLogs();

  const replay = useCallback(async () => {
    if (!userAddress || !selectedLog || !selectedLog?.args) return;

    replayDeposit({
      customClient,
      userAddress,
      args: selectedLog.args,
    });
  }, [customClient, selectedLog, userAddress]);

  return replay;
};
