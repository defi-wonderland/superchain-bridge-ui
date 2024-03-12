import { Box, Typography, styled } from '@mui/material';
import Image from 'next/image';

import errorIcon from '~/assets/icons/x-circle.svg';
import BaseModal from '~/components/BaseModal';
import { useCustomTheme, useModal, useTransactionData } from '~/hooks';
import { PrimaryButton } from '~/components';
import { ModalType } from '~/types';

export const ErrorModal = () => {
  const { errorMessage } = useTransactionData();
  const { closeModal } = useModal();

  return (
    <BaseModal type={ModalType.ERROR}>
      <ModalBody>
        <Image src={errorIcon} alt='Success' width={100} height={100} />
        <Typography variant='h4'>Transaction failed</Typography>
        <Typography variant='body1'>{errorMessage}</Typography>
      </ModalBody>
      <PrimaryButton variant='contained' color='primary' fullWidth onClick={closeModal}>
        Confirm
      </PrimaryButton>
    </BaseModal>
  );
};

const ModalBody = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    marginTop: '-3.2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',

    img: {
      width: '10.2rem',
      height: '10.2rem',
      background: '#45110b', // fixed color
      padding: '0.4rem',
      borderRadius: '50%',
      border: '1.3rem solid #30110d', // fixed color
    },

    h4: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: '150%',
      marginTop: '2rem',
      marginBottom: '0.8rem',
      color: currentTheme.steel[100],
    },

    p: {
      textAlign: 'center',
      fontWeight: 500,
      fontSize: '1.6rem',
      color: currentTheme.steel[400],
      marginBottom: '1.2rem',
    },
  };
});
