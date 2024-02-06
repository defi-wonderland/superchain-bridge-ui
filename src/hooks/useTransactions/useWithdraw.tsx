import { Address, Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { initiateERC20Withdraw, initiateETHWithdraw, initiateMessageWithdraw } from '~/utils';

export const useWithdraw = () => {
  const { mint, userAddress, data } = useTransactionData();
  const { selectedToken, amount, toToken, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();

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
        amount: parseTokenUnits(amount),
        userAddress,
        l1TokenAddress: selectedToken.address as Address,
        l2TokenAddress: toToken?.address as Address,
      });
    }
  };

  return withdraw;
};
