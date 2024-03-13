import { useCallback } from 'react';
import { Address, Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { depositForBurn, receiveMessage } from '~/utils';

import cctp from '~/data/cctp.json';
import { CCTPData } from '~/types';

export const useCCTP = () => {
  const cctpData = cctp as CCTPData;
  const { userAddress } = useTransactionData();
  const { selectedToken, amount, allowance, approve, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();

  const initiate = useCallback(async () => {
    if (!userAddress) return;

    const { message, attestation } = await depositForBurn({
      customClient,
      userAddress,
      usdcAddress: selectedToken?.address as Address,
      amount: parseTokenUnits(amount),
      allowance,
      approve,
      data: cctpData,
    });

    return { message, attestation };
  }, [allowance, amount, approve, cctpData, customClient, parseTokenUnits, selectedToken?.address, userAddress]);

  const finalize = useCallback(
    async (message?: string | Hex, attestation?: string | Hex) => {
      if (!userAddress || !message || !attestation) return;

      await receiveMessage({
        customClient,
        userAddress,
        message: message as Hex,
        attestation: attestation as Hex,
        destinationChain: customClient.to.public.chain,
        data: cctpData,
      });
    },
    [cctpData, customClient, userAddress],
  );

  return { initiate, finalize };
};
