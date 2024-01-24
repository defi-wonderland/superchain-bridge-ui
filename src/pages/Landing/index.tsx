import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getL2TransactionHashes } from 'viem/op-stack';
import { useAccount, useChainId, useSendTransaction } from 'wagmi';

import { useL1Client, useL2Client, useOptimismSdk } from '~/hooks';

import { MainCard } from './MainCard';

export const Landing = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { t } = useTranslation();
  const { publicClientL1, walletClientL1 } = useL1Client();
  const { sendTransaction } = useSendTransaction();
  const { publicClientL2 } = useL2Client();

  const { crosschainMessenger } = useOptimismSdk();

  const handleDepositWithSDK = async () => {
    const response = crosschainMessenger?.depositETH('1');

    // Log the L2 transaction receipt.
    console.log(response);
  };

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

  return (
    <LandingContainer>
      <h1 data-testid='boilerplate-title'>{t('headerTitle', { appName: 'Superchain Bridge' })}</h1>
      <p>Connected account: {address}</p>
      <p>Connected to chainId: {chainId}</p>

      <br />
      <button onClick={handleDepositWithSDK}>Deposit with OP-SDK</button>
      <br />

      <button onClick={handleDeposit}>Deposit with Viem</button>
      <br />

      <button onClick={handleSend}>Send some ETH to myself</button>
      <MainCard />
    </LandingContainer>
  );
};

const LandingContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 16rem);
  padding: 0 8rem;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
