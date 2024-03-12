import { Box, Divider, Typography, styled } from '@mui/material';
import Image from 'next/image';

import clockIcon from '~/assets/icons/clock.svg';
import gasIcon from '~/assets/icons/gas.svg';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useTransactions, useCustomTheme, useModal, useChain } from '~/hooks';
import { PrimaryButton, STooltip, SecondaryButton } from '~/components';
import { chainData, truncateAddress } from '~/utils';
import { ModalType, TransactionType } from '~/types';

export const ReviewModal = () => {
  const { closeModal } = useModal();
  const { transactionType, value, mint, to, userAddress, data } = useTransactionData();
  const { selectedToken, amount } = useToken();
  const { executeTransaction } = useTransactions();
  const { toChain } = useChain();

  const totalAmount = amount || mint || value;

  const handleConfirm = async () => {
    executeTransaction();
  };

  const showData =
    transactionType !== TransactionType.PROVE &&
    transactionType !== TransactionType.REPLAY &&
    transactionType !== TransactionType.FINALIZE;

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
        <span>
          <Image src={chainData[toChain.id].logo} alt='standar bridge logo' width={20} height={20} />
          OP Standard Bridge
        </span>
      </DataRow>

      {/* Fees */}
      <DataRow>
        <Typography variant='body1'>Fees</Typography>
        <span>
          <Image src={gasIcon} alt='fees' />
          {/* TODO: calculate fees */}
          {'-'}
        </span>
      </DataRow>

      {/* Transaction time */}
      <DataRow>
        <Typography variant='body1'>Transaction time</Typography>
        <span>
          <Image src={clockIcon} alt='transaction time' />
          2m
        </span>
      </DataRow>

      <SDivider />

      {/* Origin address */}
      <DataRow>
        <Typography variant='body1'>From address</Typography>
        <STooltip title={userAddress} className='address'>
          <span>{truncateAddress(userAddress || '')}</span>
        </STooltip>
      </DataRow>

      {/* Destination address */}
      <DataRow>
        <Typography variant='body1'>To address</Typography>
        <STooltip title={to} className='address'>
          <span>{truncateAddress(to)}</span>
        </STooltip>
      </DataRow>

      {showData && (
        <>
          <SDivider />

          {data && (
            // Custom data sent
            <DataRow>
              <Typography variant='body1'>Custom data</Typography>
              <span>{data.length > 10 ? truncateAddress(data) : data}</span>
            </DataRow>
          )}

          {!data && (
            <>
              {/* Token sent */}
              <DataRow>
                <Typography variant='body1'>Send</Typography>
                <span>
                  <Image src={selectedToken?.logoURI} alt={selectedToken?.name} width={20} height={20} />
                  {totalAmount} {selectedToken?.symbol}
                </span>
              </DataRow>

              {/* Token received */}
              <DataRow>
                <Typography variant='body1'>Receive</Typography>
                <span>
                  <Image src={selectedToken?.logoURI} alt={selectedToken?.name} width={20} height={20} />
                  {totalAmount} {selectedToken?.symbol}
                </span>
              </DataRow>
            </>
          )}
        </>
      )}

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
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',

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
