import { Address } from 'viem';

import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { forceErc20Transfer, forceErc20Withdrawal, forceEthTransfer, forceEthWithdrawal } from '~/utils';

export const useForceTx = () => {
  const { userAddress, to, value, customTransactionType } = useTransactionData();
  const { selectedToken, amount, toToken, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();

  const forceTx = async () => {
    if (!userAddress) return;

    if (customTransactionType === 'force-withdrawal') {
      if (selectedToken?.symbol === 'ETH') {
        // temporary logs
        console.log('calling forceEthWithdrawal');

        await forceEthWithdrawal({
          customClient,
          userAddress,
          amount: parseTokenUnits(value),
          to: to as Address,
        });
      }
      if (selectedToken?.symbol !== 'ETH') {
        console.log('calling forceErc20Withdrawal');

        await forceErc20Withdrawal({
          customClient,
          userAddress,
          amount: parseTokenUnits(amount),
          to: to as Address,
          l1TokenAddress: selectedToken.address as Address,
          l2TokenAddress: toToken?.address as Address,
        });
      }
    } else if (customTransactionType === 'force-transfer') {
      if (selectedToken?.symbol === 'ETH') {
        console.log('calling forceEthTransfer');

        await forceEthTransfer({
          customClient,
          userAddress,
          amount: parseTokenUnits(value),
          to: to as Address,
        });
      }
      if (selectedToken?.symbol !== 'ETH') {
        console.log('calling forceErc20Transfer');

        await forceErc20Transfer({
          customClient,
          userAddress,
          amount: parseTokenUnits(amount),
          to: to as Address, // TODO: check if it is a valid address (!userAddress && !zeroAddress)
          tokenAddress: selectedToken.address as Address,
        });
      }
    }
  };

  return forceTx;
};
