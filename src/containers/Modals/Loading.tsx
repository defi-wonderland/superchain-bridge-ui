import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';

import { Step } from '~/components';
import BaseModal from '~/components/BaseModal';
import { useCustomTheme, useTransactionData } from '~/hooks';
import { ModalType, TransactionStep } from '~/types';

export const LoadingModal = () => {
  const { txStep } = useTransactionData();
  const [time, setTime] = useState(3);

  const dynamicRedirectText = useMemo(() => {
    if (txStep === TransactionStep.FINALIZED) return `Redirecting in ${time}`;
    return 'You can safely close this modal';
  }, [time, txStep]);

  useEffect(() => {
    if (txStep !== TransactionStep.FINALIZED) return;

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time, txStep]);

  return (
    <BaseModal type={ModalType.LOADING} title='Transaction pending'>
      <SBox>
        {txStep === TransactionStep.INITIATE && (
          <>
            <Step text='Initiate Transaction' status='pending' />
            <Step text='Processing Transaction' status='idle' />
            <Step text='Relaying Transaction' status='idle' connector={false} />
          </>
        )}
        {txStep === TransactionStep.PROCESSING && (
          <>
            <Step text='Initiate Transaction' status='success' />
            <Step text='Processing Transaction' status='pending' />
            <Step text='Relaying Transaction' status='idle' connector={false} />
          </>
        )}
        {txStep === TransactionStep.REPLAYING && (
          <>
            <Step text='Initiate Transaction' status='success' />
            <Step text='Processing Transaction' status='success' />
            <Step text='Relaying Transaction' status='pending' connector={false} />
          </>
        )}
        {txStep === TransactionStep.FINALIZED && (
          <>
            <Step text='Initiate Transaction' status='success' />
            <Step text='Processing Transaction' status='success' />
            <Step text='Relaying Transaction' status='final' />
          </>
        )}

        <STypography variant='body1'>{dynamicRedirectText}</STypography>
      </SBox>
    </BaseModal>
  );
};

const SBox = styled(Box)(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
});

const STypography = styled(Typography)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'block',
    color: currentTheme.steel[500],
    fontSize: '1.4rem',
    fontWeight: 400,
  };
});
