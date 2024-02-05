import { Address } from 'viem';

import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { ForceTransactionType } from '~/types';
import { forceErc20Transfer, forceEthTransfer, forceEthWithdrawal } from '~/utils';

export const useForceTx = () => {
  const { userAddress, isForceTransaction, to, value, forceTransactionType } = useTransactionData();
  const { selectedToken, amount, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();

  const froceTx = async () => {
    if (!userAddress) return;

    if (isForceTransaction) {
      switch (forceTransactionType) {
        case ForceTransactionType.ETH_TRANSFER:
          await forceEthTransfer({
            customClient,
            userAddress,
            amount: parseTokenUnits(value),
            to: to as Address,
          });
          return;

        case ForceTransactionType.ERC20_TRANSFER:
          if (!selectedToken?.address) return;
          await forceErc20Transfer({
            customClient,
            userAddress,
            amount: parseTokenUnits(amount),
            to: to as Address, // TODO: check if it is a valid address (!userAddress && !zeroAddress)
            tokenAddress: selectedToken.address as Address,
          });
          return;

        case ForceTransactionType.ETH_WITHDRAWAL:
          await forceEthWithdrawal({
            customClient,
            userAddress,
            amount: parseTokenUnits(value),
            to: to as Address,
          });
          return;

        case ForceTransactionType.ERC20_WITHDRAWAL:
          // TODO: Implement ERC20 withdrawal
          return;
      }
    }
  };

  return froceTx;
};
