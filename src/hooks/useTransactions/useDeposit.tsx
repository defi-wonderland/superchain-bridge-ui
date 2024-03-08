import { Address, Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { depositERC20, depositETH, depositMessage } from '~/utils';
import { useForceTx } from './useForceTx';

export const useDeposit = () => {
  const { mint, userAddress, data, to, customTransactionType, setTxMetadata } = useTransactionData();
  const { selectedToken, amount, allowance, toToken, approve, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();
  const forceTx = useForceTx();

  const deposit = async () => {
    if (!userAddress) return;

    if (customTransactionType === 'custom-tx') {
      // temporary logs
      console.log('calling depositMessage');

      await depositMessage({
        setTxMetadata,
        customClient,
        userAddress: userAddress,
        data: data as Hex,
        target: to as Address,
      });
    } else if (customTransactionType?.includes('force')) {
      console.log('calling forceTx');

      await forceTx();
    } else {
      if (selectedToken?.symbol === 'ETH') {
        console.log('calling depositETH');

        await depositETH({
          setTxMetadata,
          customClient,
          userAddress,
          mint: parseTokenUnits(mint),
          to: userAddress,
        });
      } else {
        console.log('calling depositERC20');

        await depositERC20({
          setTxMetadata,
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
