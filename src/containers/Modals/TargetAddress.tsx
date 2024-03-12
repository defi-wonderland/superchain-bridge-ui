import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import Image from 'next/image';

import checkIcon from '~/assets/icons/check.svg';
import warningIcon from '~/assets/icons/exclamation-triangle.svg';

import { useCustomTheme, useModal, useTransactionData } from '~/hooks';
import BaseModal from '~/components/BaseModal';
import { InputField } from '~/components';
import { ModalType } from '~/types';

export const TargetAddress = () => {
  const { address } = useAccount();
  const { closeModal, modalOpen } = useModal();
  const { setTo, to } = useTransactionData();
  const [targetAddress, setTargetAddress] = useState('');

  const isError = !isAddress(targetAddress);

  const supportText = useMemo(() => {
    if (targetAddress === address) return 'This is your connected wallet address';

    return isError ? 'Please enter a valid wallet address' : 'This is not your connected wallet address';
  }, [address, isError, targetAddress]);

  const handleSave = () => {
    setTo(targetAddress);
    closeModal();
  };

  useEffect(() => {
    if (modalOpen === ModalType.SELECT_ACCOUNT) {
      setTargetAddress(to);
    }
  }, [modalOpen, to]);

  return (
    <BaseModal type={ModalType.SELECT_ACCOUNT} title='Destination address'>
      <ModalContainer>
        <InputField
          label='To address'
          value={targetAddress}
          setValue={setTargetAddress}
          error={!!isError}
          placeholder=''
        />

        <TextContainer>
          {!isError && (
            <Image src={targetAddress === address ? checkIcon : warningIcon} alt='' width={16} height={16} />
          )}
          <Typography variant='body2' className={isError ? 'error' : targetAddress === address ? '' : 'warning'}>
            {supportText}
          </Typography>
        </TextContainer>

        <StyledButton variant='contained' color='primary' onClick={handleSave} disabled={!!isError} fullWidth>
          Save
        </StyledButton>
      </ModalContainer>
    </BaseModal>
  );
};

const StyledButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.ghost[400],
    color: currentTheme.steel[900],
    border: 'none',
    padding: '1rem 1.8rem',
    borderRadius: '0.8rem',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '1.6rem',
    marginTop: '3.2rem',
    '&:hover': {
      backgroundColor: currentTheme.ghost[500],
    },
  };
});

const ModalContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    width: '100%',
  };
});

const TextContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '2rem',
    gap: '0.4rem',
    marginTop: '0.6rem',
    color: currentTheme.successPrimary,

    img: {
      marginTop: '0.1rem',
    },

    '.error': {
      color: currentTheme.errorPrimary,
    },

    '.warning': {
      color: currentTheme.warningPrimary,
    },
  };
});
