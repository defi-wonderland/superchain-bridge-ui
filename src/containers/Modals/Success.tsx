import { Box, Typography, styled } from '@mui/material';
import Image from 'next/image';

import successIcon from '~/assets/icons/check-circle.svg';
import BaseModal from '~/components/BaseModal';
import { useCustomTheme, useModal, useQueryParams, useTransactionData } from '~/hooks';
import { PrimaryButton } from '~/components';
import { ModalType, QueryParamKey } from '~/types';
import Link from 'next/link';

export const SuccessModal = () => {
  const { closeModal } = useModal();
  const { getParam } = useQueryParams();
  const { userAddress } = useTransactionData();
  const chain = getParam(QueryParamKey.chain);

  return (
    <BaseModal type={ModalType.SUCCESS}>
      <ModalBody>
        <Image src={successIcon} alt='Success' width={100} height={100} />
        <Typography variant='h4'>Transaction complete</Typography>
        <Link href={`/${chain}/account/${userAddress}`} onClick={closeModal}>
          View on account history
        </Link>
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
      background: '#1f3d2b', // fixed color
      padding: '0.4rem',
      borderRadius: '50%',
      border: '1.3rem solid #15281d', // fixed color
    },

    h4: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: '150%',
      marginTop: '2rem',
      marginBottom: '0.8rem',
      color: currentTheme.steel[100],
    },

    a: {
      fontWeight: 500,
      fontSize: '1.6rem',
      color: currentTheme.ghost[400],
      textDecoration: 'underline',
      marginBottom: '1.2rem',
    },
  };
});
