import { CustomClients, DepositLogs, WithdrawLogs } from '~/types';
import { messagePassedAbi, transactionDepositedABI } from '../parsedAbis';
import { Address } from 'viem';
import { GetWithdrawalStatusParameters } from 'viem/op-stack';

interface GetWithdrawalLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getWithdrawLogs = async ({
  customClient,
  userAddress,
}: GetWithdrawalLogsParameters): Promise<WithdrawLogs> => {
  if (!userAddress) throw new Error('No user address provided');
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

  const receipts = await Promise.all(
    logs.map(({ transactionHash }) => {
      return customClient.to.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  const status = await Promise.all(
    receipts.map((receipt) => {
      return customClient.from.public.getWithdrawalStatus({
        receipt,
        targetChain: customClient.to.public.chain,
      } as GetWithdrawalStatusParameters);
    }),
  );

  return { logs, receipts, status };
};

interface GetDepositLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getDepositLogs = async ({ customClient, userAddress }: GetDepositLogsParameters): Promise<DepositLogs> => {
  if (!userAddress) throw new Error('No user address provided');
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

  const receipts = await Promise.all(
    logs.map(({ transactionHash }) => {
      return customClient.from.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  return { logs, receipts };
};
