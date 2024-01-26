import { useTranslation } from 'react-i18next';

import { BridgeCard } from '~/containers';

const Landing = () => {
  const { t } = useTranslation();
  // const { publicClientL1, walletClientL1 } = useL1Client();
  // const { sendTransaction } = useSendTransaction();
  // const { publicClientL2 } = useL2Client();

  // const handleDeposit = async () => {
  //   if (!walletClientL1) return;

  //   // Build parameters for the transaction on the L2.
  //   const args = await publicClientL2.buildDepositTransaction({
  //     account: address,
  //     mint: 1n,
  //     to: address,
  //   });

  //   // Execute the deposit transaction on the L1.
  //   const hash = await walletClientL1.depositTransaction(args);

  //   // Wait for the L1 transaction to be processed.
  //   const receipt = await publicClientL1.waitForTransactionReceipt({ hash });

  //   // Get the L2 transaction hash from the L1 transaction receipt.
  //   const [l2Hash] = getL2TransactionHashes(receipt);

  //   // Wait for the L2 transaction to be processed.
  //   const l2Receipt = await publicClientL2.waitForTransactionReceipt({
  //     hash: l2Hash,
  //   });

  //   // Log the L2 transaction receipt.
  //   console.log(l2Receipt);
  // };

  // const handleSend = async () => {
  //   address && sendTransaction({ value: 1n, to: address });
  // };

  return (
    <section>
      <h1 data-testid='boilerplate-title'>{t('HEADER.title', { appName: 'Superchain Bridge' })}</h1>

      <BridgeCard />
    </section>
  );
};

export default Landing;
