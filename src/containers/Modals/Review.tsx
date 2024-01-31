import { Box, Button, styled } from '@mui/material';
import { parseEther } from 'viem';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useCustomClient } from '~/hooks';
import { ModalType, TransactionType } from '~/types';

export const ReviewModal = () => {
  const { transactionType, mint, userAddress } = useTransactionData();
  const { customClient } = useCustomClient();
  const { selectedToken } = useToken();

  const handleConfirm = async () => {
    try {
      // setModalOpen(ModalType.LOADING);
      if (!userAddress) return;

      if (transactionType === TransactionType.DEPOSIT) {
        // Deposit
        const args = await customClient.to.buildDepositTransaction({
          mint: parseEther(mint),
          to: userAddress,
          chain: customClient.to.chain,
        });

        console.log(args);

        // temporary any, typings from viem are kinda broken
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hash = await customClient.from?.depositTransaction(args as any);
        console.log(hash);
      }
    } catch (e) {
      console.warn('Error: ', e);
    }
  };

  return (
    <BaseModal type={ModalType.REVIEW}>
      <ModalBody>
        <h1>Review modal</h1>
        <p>Transaction: {transactionType}</p>
        <p>Token: {selectedToken?.symbol}</p>

        <Button variant='contained' color='primary' fullWidth onClick={handleConfirm}>
          Initiate Transaction
        </Button>
      </ModalBody>
    </BaseModal>
  );
};

const ModalBody = styled(Box)(() => {
  return {
    height: '30rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };
});
