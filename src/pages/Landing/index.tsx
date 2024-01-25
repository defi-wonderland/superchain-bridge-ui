import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useChainId, useSendTransaction } from 'wagmi';
import { getL2TransactionHashes } from 'viem/op-stack';

import { useQueryParams, useL1Client, useL2Client } from '~/hooks';
import { QueryParamKey } from '~/types';

import { MainCard } from './MainCard';

export const Landing = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { t } = useTranslation();
  const { updateQueryParams } = useQueryParams();
  const { publicClientL1, walletClientL1 } = useL1Client();
  const { sendTransaction } = useSendTransaction();
  const { publicClientL2 } = useL2Client();

  const handleDeposit = async () => {
    // Build parameters for the transaction on the L2.
    const args = await publicClientL2.buildDepositTransaction({
      account: address,
      mint: 1n,
      to: address,
    });

    // Execute the deposit transaction on the L1.
    const hash = await walletClientL1.depositTransaction(args);

    // Wait for the L1 transaction to be processed.
    const receipt = await publicClientL1.waitForTransactionReceipt({ hash });

    // Get the L2 transaction hash from the L1 transaction receipt.
    const [l2Hash] = getL2TransactionHashes(receipt);

    // Wait for the L2 transaction to be processed.
    const l2Receipt = await publicClientL2.waitForTransactionReceipt({
      hash: l2Hash,
    });

    // Log the L2 transaction receipt.
    console.log(l2Receipt);
  };

  const handleSend = async () => {
    address && sendTransaction({ value: 1n, to: address });
  };

  useEffect(() => {
    if (chainId) updateQueryParams(QueryParamKey.originChainId, chainId.toString());
  }, [chainId, updateQueryParams]);

  return (
    <section>
      <h1 data-testid='boilerplate-title'>{t('HEADER.title', { appName: 'Superchain Bridge' })}</h1>
      <p>Connected account: {address}</p>
      <p>Connected to chainId: {chainId}</p>

      <br />

      <button onClick={handleDeposit}>Deposit with Viem</button>
      <br />

      <button onClick={handleSend}>Send some ETH to myself</button>
      <MainCard />
    </section>
  );
};
