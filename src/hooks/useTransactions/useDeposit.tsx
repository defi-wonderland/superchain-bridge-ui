import { Address, Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { depositERC20, depositETH, depositMessage } from '~/utils';
import { useForceTx } from './useForceTx';

export const useDeposit = () => {
  const { mint, userAddress, data, isForceTransaction } = useTransactionData();
  const { selectedToken, amount, allowance, toToken, approve, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();
  const forceTx = useForceTx();

  const deposit = async () => {
    if (!userAddress) return;

    if (isForceTransaction) {
      await forceTx();
    } else {
      if (!selectedToken) {
        await depositMessage({
          customClient,
          userAddress: userAddress,
          data: data as Hex,
        });
      } else if (selectedToken?.symbol === 'ETH') {
        await depositETH({
          customClient,
          userAddress,
          mint: parseTokenUnits(mint),
          to: userAddress,
        });
      } else {
        await depositERC20({
          customClient,
          l1TokenAddress: selectedToken.address as Address,
          l2TokenAddress: toToken?.address as Address,
          amount: parseTokenUnits(amount),
          userAddress,
          allowance,
          approve,
        });
      }
    }
  };

  return deposit;
};
