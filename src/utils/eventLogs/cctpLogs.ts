import { Address, parseAbiItem } from 'viem';

import { CctpType, CustomClients, UsdcBurnData } from '~/types';
import { bytes32ToBytes20 } from '../misc';
import { formatCctpLogs } from './formatCctpLogs';

export const getCctpLogs = async ({ customClient, userAddress, data }: GetAllDepositLogsParameters) => {
  const burnData = await getDepositForBurnLogs({ customClient, userAddress, data });
  const newBurnData = await getMintEvents({ customClient, data, burnData });

  const formattedLogs = formatCctpLogs(customClient, newBurnData);
  return formattedLogs;
};

interface GetAllDepositLogsParameters {
  customClient: CustomClients;
  userAddress: Address;
  data: CctpType;
}
export const getDepositForBurnLogs = async ({ customClient, userAddress, data }: GetAllDepositLogsParameters) => {
  try {
    const { tokenMessenger } = data[customClient.from.public.chain!.id];

    const depositLogs = await customClient.from.public.getLogs({
      address: tokenMessenger,
      event: parseAbiItem(
        'event DepositForBurn(uint64 indexed nonce,address indexed burnToken,uint256 amount,address indexed depositor,bytes32 mintRecipient,uint32 destinationDomain,bytes32 destinationTokenMessenger,bytes32 destinationCaller)',
      ),
      args: {
        depositor: userAddress,
      },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    const usdcBurnData: UsdcBurnData = depositLogs.map((log) => {
      return {
        sourceBlockNumber: log.blockNumber,
        sourceHash: log.transactionHash,
        nonce: log.args.nonce,
        burnToken: log.args.burnToken,
        amount: log.args.amount,
        depositor: log.args.depositor,
        mintRecipient: bytes32ToBytes20(log.args.mintRecipient!),
        destinationDomain: log.args.destinationDomain,
        destinationTokenMessenger: bytes32ToBytes20(log.args.destinationTokenMessenger!),
        destinationCaller: bytes32ToBytes20(log.args.destinationCaller!),
        received: false,
      };
    });

    return usdcBurnData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

interface GetAllMintLogsParameters {
  customClient: CustomClients;
  data: CctpType;
  burnData: UsdcBurnData;
}
const getMintEvents = async ({ customClient, data, burnData }: GetAllMintLogsParameters) => {
  try {
    const nonces = burnData.map((burn) => burn.nonce!);
    const { messageTransmitter } = data[customClient.to.public.chain!.id];

    const mintLogs = await customClient.to.public.getLogs({
      address: messageTransmitter,
      event: parseAbiItem(
        'event MessageReceived(address indexed caller,uint32 sourceDomain,uint64 indexed nonce,bytes32 sender,bytes messageBody)',
      ),
      args: {
        nonce: nonces,
      },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    const newBurnData = burnData.map((burn) => {
      const mintLog = mintLogs.find((log) => log.args.nonce === burn.nonce);
      if (mintLog) {
        return {
          ...burn,
          received: true,
          destinationBlockNumber: mintLog.blockNumber,
          destinationHash: mintLog.transactionHash,
        };
      }

      return burn;
    });

    const filteredBurnData = newBurnData.filter(
      (burn) => burn.destinationDomain === data[customClient.to.public.chain!.id].domain,
    );

    return filteredBurnData;
  } catch (error) {
    console.error(error);
    return [];
  }
};
