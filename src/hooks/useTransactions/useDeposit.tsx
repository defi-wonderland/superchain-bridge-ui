import { Address, Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient, useTokenList, useChain } from '~/hooks';
import { ForceTransactionType } from '~/types';
import { depositERC20, depositETH, depositMessage, forceEthTransfer } from '~/utils';

export const useDeposit = () => {
  const { mint, userAddress, data, isForceTransaction, to, value, forceTransactionType } = useTransactionData();
  const { selectedToken, amount, allowance, approve, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();
  const { toTokens } = useTokenList();
  const { toChain } = useChain();

  const deposit = async () => {
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
          // TODO: Implement ERC20 transfer
          return;

        case ForceTransactionType.ERC20_WITHDRAWAL:
          // TODO: Implement ERC20 withdrawal
          return;

        case ForceTransactionType.ETH_WITHDRAWAL:
          // TODO: Implement ETH withdrawal
          return;
      }
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
    }
  };

  return deposit;
};
