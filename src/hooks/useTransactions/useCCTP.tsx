import { useCallback } from 'react';
import { Address, Hex } from 'viem';

import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { depositForBurn, getAttestation, receiveMessage } from '~/utils';

import CCTP from '~/data/cctp.json';
import { CctpType } from '~/types';

export const useCCTP = () => {
  const cctpData = CCTP as CctpType;
  const { userAddress } = useTransactionData();
  const { selectedToken, amount, allowance, approve, parseTokenUnits } = useToken();
  const { customClient } = useCustomClient();

  const initiate = useCallback(async () => {
    if (!userAddress) return;

    return await depositForBurn({
      customClient,
      userAddress,
      usdcAddress: selectedToken?.address as Address,
      amount: parseTokenUnits(amount),
      allowance,
      approve,
      data: cctpData,
    });
  }, [allowance, amount, approve, cctpData, customClient, parseTokenUnits, selectedToken?.address, userAddress]);

  const finalize = useCallback(
    async (hash?: string | Hex) => {
      if (!userAddress || !hash) return;

      const { message, attestation } = await getAttestation({
        customClient,
        hash,
      });

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
