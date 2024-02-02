import { Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient, useTokenList, useChain } from '~/hooks';
import { initiateERC20Withdraw, initiateETHWithdraw, initiateMessageWithdraw } from '~/utils';

export const useWithdraw = () => {
  const { mint, userAddress, data } = useTransactionData();
  const { selectedToken, amount, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();
  const { toTokens } = useTokenList();
  const { toChain } = useChain();

  const withdraw = async () => {
    if (!userAddress) return;

    if (!selectedToken) {
      await initiateMessageWithdraw({
        customClient,
        userAddress: userAddress,
        message: data as Hex,
      });
    } else if (selectedToken?.symbol === 'ETH') {
      await initiateETHWithdraw({
        customClient,
        userAddress,
        mint: parseTokenUnits(mint),
        to: userAddress,
      });
    } else {
      await initiateERC20Withdraw({
        customClient,
        selectedToken,
        amount: parseTokenUnits(amount),
        userAddress,
        toChain,
        toTokens,
      });
    }
  };

  return withdraw;
};
