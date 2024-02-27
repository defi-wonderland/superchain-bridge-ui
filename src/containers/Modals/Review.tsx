import { Box, Divider, Typography, styled } from '@mui/material';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useTransactions, useCustomTheme, useModal } from '~/hooks';
import { PrimaryButton, SecondaryButton } from '~/components';
import { truncateAddress } from '~/utils';
import { ModalType } from '~/types';

export const ReviewModal = () => {
  const { closeModal } = useModal();
  const { transactionType, value, mint, to, userAddress } = useTransactionData();
  const { selectedToken, amount } = useToken();
  const { executeTransaction } = useTransactions();

  const totalAmount = amount || mint || value;

  const handleConfirm = async () => {
    executeTransaction();
  };

  return (
    <BaseModal type={ModalType.REVIEW} title='Review transaction'>
      {/* Transaction type */}
      <DataRow>
        <Typography variant='body1'>Transaction type</Typography>
        <span>{transactionType}</span>
      </DataRow>

      {/* Selected Bridge */}
      <DataRow>
        <Typography variant='body1'>Bridge</Typography>
        <span>OP Gateway</span>
      </DataRow>

      {/* Fees */}
      <DataRow>
        <Typography variant='body1'>Fees</Typography>
        <span>$21.33</span>
      </DataRow>

      {/* Transaction time */}
      <DataRow>
        <Typography variant='body1'>Transaction time</Typography>
        <span>2m</span>
      </DataRow>

      <SDivider />

      {/* Origin address */}
      <DataRow>
        <Typography variant='body1'>From address</Typography>
        <span>{truncateAddress(userAddress || '')}</span>
      </DataRow>

      {/* Destination address */}
      <DataRow>
        <Typography variant='body1'>To address</Typography>
        <span>{truncateAddress(to)}</span>
      </DataRow>

      <SDivider />

      {/* Token sent */}
      <DataRow>
        <Typography variant='body1'>Send</Typography>
        <span>
          {totalAmount} {selectedToken?.symbol}
        </span>
      </DataRow>

      {/* Token received */}
      <DataRow>
        <Typography variant='body1'>Receive</Typography>
        <span>
          {totalAmount} {selectedToken?.symbol}
        </span>
      </DataRow>

      <ButtonsContainer>
        <SecondaryButton variant='contained' color='primary' fullWidth onClick={closeModal}>
          Cancel
        </SecondaryButton>

        <PrimaryButton variant='contained' color='primary' fullWidth onClick={handleConfirm}>
          Confirm
        </PrimaryButton>
      </ButtonsContainer>
    </BaseModal>
  );
};

const SDivider = styled(Divider)(() => {
  return {
    width: '100%',
    border: '1px solid #292B2E', //fixed color
  };
});

export const DataRow = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    p: {
      fontSize: '1.6rem',
      color: currentTheme.steel[300],
      fontWeight: 400,
      lineHeight: '150%' /* 24px */,
      letterSpacing: '-0.352px',
    },
    span: {
      fontSize: '1.6rem',
      color: currentTheme.steel[100],
      lineHeight: '150%' /* 24px */,
      letterSpacing: '-0.352px',
    },
  };
});

const ButtonsContainer = styled(Box)(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1.2rem',
    marginTop: '2rem',
  };
});
