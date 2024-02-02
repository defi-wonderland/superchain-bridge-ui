import { Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient, useTokenList, useChain } from '~/hooks';
import { depositERC20, depositETH, depositMessage } from '~/utils';

export const useDeposit = () => {
  const { mint, userAddress, data } = useTransactionData();
  const { selectedToken, amount, allowance, approve, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();
  const { toTokens } = useTokenList();
  const { toChain } = useChain();

  const deposit = async () => {
    if (!userAddress) return;

    if (!selectedToken) {
      await depositMessage({
        customClient,
        userAddress: userAddress,
        data: data as Hex,
      });
    } else if (selectedToken?.symbol === 'ETH') {
      await depositETH({
        customClient,
        mint: parseTokenUnits(mint),
        to: userAddress,
      });
    } else {
      await depositERC20({
        customClient,
        selectedToken,
        amount: parseTokenUnits(amount),
        userAddress,
        allowance,
        approve,
        toChain,
        toTokens,
      });
    }
  };

  return deposit;
};
