import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';

import { useCustomTheme, useModal, useTransactionData } from '~/hooks';
import BaseModal from '~/components/BaseModal';
import { InputField } from '~/components';
import { ModalType } from '~/types';

export const TargetAddress = () => {
  const { address } = useAccount();
  const { closeModal } = useModal();
  const { setTo, to } = useTransactionData();
  const [targetAddress, setTargetAddress] = useState('');

  const isError = targetAddress && !isAddress(targetAddress);

  const supportText = useMemo(() => {
    if (targetAddress === address) return 'This is your connected wallet address';

    return isError ? 'Please enter a valid wallet address' : 'This is not your connected wallet address';
  }, [address, isError, targetAddress]);

  const handleSave = () => {
    setTo(targetAddress);
    closeModal();
  };

  useEffect(() => {
    setTargetAddress(to);
  }, [to]);

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
          <Typography variant='body2' color='error'>
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
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    height: '2rem',
    marginTop: '0.6rem',
  };
});
