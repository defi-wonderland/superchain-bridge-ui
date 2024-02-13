import { Address, GetLogsReturnType, Hex, PublicClient } from 'viem';

import { failedRelayedMessageABI } from '../parsedEvents';

interface GetFailedTransactionLogsParameters {
  publicClient: PublicClient;
  crossDomainMessenger: Address;
  userAddress: Address;
  msgHashes: Hex[];
}
export const getFailedTransactionLogs = async ({
  publicClient,
  msgHashes,
  crossDomainMessenger,
}: GetFailedTransactionLogsParameters): Promise<GetLogsReturnType<typeof failedRelayedMessageABI>> => {
  const errorLogs = await publicClient.getLogs({
    address: crossDomainMessenger,
    event: failedRelayedMessageABI,
    args: {
      msgHash: msgHashes,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  return errorLogs;
};
