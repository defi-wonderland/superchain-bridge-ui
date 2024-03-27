import { Box, Divider, Typography, styled, IconButton } from '@mui/material';
import Image from 'next/image';

import clockIcon from '~/assets/icons/clock.svg';
import gasIcon from '~/assets/icons/gas.svg';
import copyIcon from '~/assets/icons/copy.svg';
import copyCheckIcon from '~/assets/icons/copy-check.svg';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useTransactions, useCustomTheme, useModal, useCopyToClipboard } from '~/hooks';
import { PrimaryButton, STooltip, SecondaryButton } from '~/components';
import { formatDataNumber, truncateAddress } from '~/utils';
import { ModalType, TransactionType } from '~/types';

export const ReviewModal = () => {
  const { closeModal } = useModal();
  const { transactionType, value, mint, to, userAddress, data } = useTransactionData();
  const { selectedToken, amount, bridgeData } = useToken();
  const { executeTransaction } = useTransactions();
  const [copiedStates, copy] = useCopyToClipboard();

  const totalAmount = amount || mint || value;

  const handleConfirm = async () => {
    executeTransaction();
  };

  const showData =
    transactionType !== TransactionType.FINALIZE_CCTP &&
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
          <Image src={bridgeData.logoUrl} alt='bridge logo' width={20} height={20} />
          {bridgeData.name}
        </span>
      </DataRow>

      {/* Fees */}
      <DataRow>
        <Typography variant='body1'>Fees</Typography>
        <span>
          <Image src={gasIcon} alt='fees' />
          {bridgeData.fees}
        </span>
      </DataRow>

      {/* Transaction time */}
      <DataRow>
        <Typography variant='body1'>Transaction time</Typography>
        <span>
          <Image src={clockIcon} alt='transaction time' />
          {bridgeData.time}
        </span>
      </DataRow>

      <SDivider />

      {/* Origin address */}
      <DataRow>
        <Typography variant='body1'>From address</Typography>
        <Box className='address-container'>
          <STooltip title={userAddress} className='address'>
            <span>{truncateAddress(userAddress || '')}</span>
          </STooltip>
          <STooltip title={copiedStates['origin'] === userAddress ? 'Copied!' : 'Copy to clipboard'} arrow>
            <IconButton onClick={() => copy('origin', userAddress || '')} className='icon-button'>
              <Image
                src={copiedStates['origin'] === userAddress ? copyCheckIcon : copyIcon}
                alt='Copy to clipboard'
                className='icon-image'
              />
            </IconButton>
          </STooltip>
        </Box>
      </DataRow>

      {/* Destination address */}
      <DataRow>
        <Typography variant='body1'>To address</Typography>
        <Box className='address-container'>
          <STooltip title={to} className='address'>
            <span>{truncateAddress(to)}</span>
          </STooltip>
          <STooltip title={copiedStates['destination'] === to ? 'Copied!' : 'Copy to clipboard'} arrow>
            <IconButton onClick={() => copy('destination', to)} className='icon-button'>
              <Image
                src={copiedStates['destination'] === to ? copyCheckIcon : copyIcon}
                alt='Copy to clipboard'
                className='icon-image'
              />
            </IconButton>
          </STooltip>
        </Box>
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
                  {formatDataNumber(totalAmount, 0, 4, false)} {selectedToken?.symbol}
                </span>
              </DataRow>

              {/* Token received */}
              <DataRow>
                <Typography variant='body1'>Receive</Typography>
                <span>
                  <Image src={selectedToken?.logoURI} alt={selectedToken?.name} width={20} height={20} />
                  {formatDataNumber(totalAmount, 0, 4, false)} {selectedToken?.symbol}
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
    '.address-container': {
      display: 'flex',
      alignItems: 'center',
    },
    '.icon-button': {
      width: '3rem',
      height: '3rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '1rem',
    },
    '.icon-image': {
      width: '100%',
      height: '100%',
    },
    '@media (max-width: 600px)': {
      p: {
        fontSize: '1.4rem',
      },
      span: {
        fontSize: '1.4rem',
      },
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
