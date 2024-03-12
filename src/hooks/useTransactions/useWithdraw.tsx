import { Address, Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient, useLogs } from '~/hooks';
import {
  finalizeWithdrawal,
  initiateERC20Withdraw,
  initiateETHWithdraw,
  initiateMessageWithdraw,
  proveWithdrawal,
} from '~/utils';

export const useWithdraw = () => {
  const { selectedLog } = useLogs();
  const { mint, userAddress, data, customTransactionType, setTxMetadata } = useTransactionData();
  const { selectedToken, amount, toToken, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();

  const withdraw = async () => {
    if (!userAddress) return;

    if (customTransactionType === 'custom-tx') {
      // temporary logs
      console.log('calling initiateMessageWithdraw');

      await initiateMessageWithdraw({
        setTxMetadata,
        customClient,
        userAddress: userAddress,
        message: data as Hex,
      });
    } else {
      if (selectedToken?.symbol === 'ETH') {
        console.log('calling initiateETHWithdraw');

        await initiateETHWithdraw({
          setTxMetadata,
          customClient,
          userAddress,
          mint: parseTokenUnits(mint),
          to: userAddress,
        });
      } else {
        console.log('calling initiateERC20Withdraw');

        await initiateERC20Withdraw({
          setTxMetadata,
          customClient,
          amount: parseTokenUnits(amount),
          userAddress,
          l1TokenAddress: selectedToken.address as Address,
          l2TokenAddress: toToken?.address as Address,
        });
      }
    }
  };

  const prove = async () => {
    if (!selectedLog || !userAddress) return;

    // temporary log
    console.log('calling proveWithdrawal');
    await proveWithdrawal({ customClient, receipt: selectedLog.receipt, userAddress, setTxMetadata });
  };

  const finalize = async () => {
    if (!selectedLog || !userAddress) return;

    // temporary log
    console.log('calling finalizeWithdrawal');
    await finalizeWithdrawal({ customClient, receipt: selectedLog.receipt, userAddress, setTxMetadata });
  };

  return { withdraw, prove, finalize };
};
