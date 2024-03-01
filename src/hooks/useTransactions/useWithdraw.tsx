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
  const { mint, userAddress, data, setTxStep } = useTransactionData();
  const { selectedToken, amount, toToken, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();

  const withdraw = async () => {
    if (!userAddress) return;

    if (!selectedToken) {
      // temporary logs
      console.log('calling initiateMessageWithdraw');

      await initiateMessageWithdraw({
        setTxStep,
        customClient,
        userAddress: userAddress,
        message: data as Hex,
      });
    } else if (selectedToken?.symbol === 'ETH') {
      console.log('calling initiateETHWithdraw');

      await initiateETHWithdraw({
        setTxStep,
        customClient,
        userAddress,
        mint: parseTokenUnits(mint),
        to: userAddress,
      });
    } else {
      console.log('calling initiateERC20Withdraw');

      await initiateERC20Withdraw({
        setTxStep,
        customClient,
        amount: parseTokenUnits(amount),
        userAddress,
        l1TokenAddress: selectedToken.address as Address,
        l2TokenAddress: toToken?.address as Address,
      });
    }
  };

  const prove = async () => {
    if (!selectedLog || !userAddress) return;

    // temporary log
    console.log('calling proveWithdrawal');
    await proveWithdrawal({ customClient, receipt: selectedLog.receipt, userAddress, setTxStep });
  };

  const finalize = async () => {
    if (!selectedLog || !userAddress) return;

    // temporary log
    console.log('calling finalizeWithdrawal');
    await finalizeWithdrawal({ customClient, receipt: selectedLog.receipt, userAddress, setTxStep });
  };

  return { withdraw, prove, finalize };
};
