import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';

import { Step } from '~/components';
import BaseModal from '~/components/BaseModal';
import { useCustomTheme, useTransactionData } from '~/hooks';
import { ModalType, TransactionStep, TransactionType } from '~/types';

export const LoadingModal = () => {
  const { txStep, transactionType } = useTransactionData();
  const [time, setTime] = useState(3);

  const dynamicRedirectText = useMemo(() => {
    if (txStep === TransactionStep.FINALIZED) return `Redirecting in ${time}`;
    return 'You can safely close this modal';
  }, [time, txStep]);

  useEffect(() => {
    if (txStep !== TransactionStep.FINALIZED) return;

    const interval = setInterval(() => {
      setTime((prev) => prev && prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time, txStep]);

  return (
    <BaseModal type={ModalType.LOADING} title='Transaction pending'>
      <SBox>
        {(transactionType === TransactionType.DEPOSIT || transactionType === TransactionType.WITHDRAW) && (
          <>
            {txStep === TransactionStep.INITIATE && (
              <>
                <Step text='Initiate Transaction' status='loading' />
                <Step text='Processing Transaction' status='idle' />
                <Step text='Relaying Transaction' status='idle' connector={false} />
              </>
            )}
            {txStep === TransactionStep.PROCESSING && (
              <>
                <Step text='Initiate Transaction' status='success' />
                <Step text='Processing Transaction' status='loading' />
                <Step text='Relaying Transaction' status='idle' connector={false} />
              </>
            )}
            {txStep === TransactionStep.REPLAYING && (
              <>
                <Step text='Initiate Transaction' status='success' />
                <Step text='Processing Transaction' status='success' />
                <Step text='Relaying Transaction' status='loading' connector={false} />
              </>
            )}
            {txStep === TransactionStep.FINALIZED && (
              <>
                <Step text='Initiate Transaction' status='success' />
                <Step text='Processing Transaction' status='success' />
                <Step text='Relaying Transaction' status='final' />
              </>
            )}
          </>
        )}

        {transactionType !== TransactionType.DEPOSIT && transactionType !== TransactionType.WITHDRAW && (
          <>
            {txStep === TransactionStep.INITIATE && (
              <>
                <Step text='Initiate Transaction' status='loading' />
                <Step text='Processing Transaction' status='idle' connector={false} />
              </>
            )}
            {txStep === TransactionStep.PROCESSING && (
              <>
                <Step text='Initiate Transaction' status='success' />
                <Step text='Processing Transaction' status='loading' connector={false} />
              </>
            )}

            {txStep === TransactionStep.FINALIZED && (
              <>
                <Step text='Initiate Transaction' status='success' />
                <Step text='Processing Transaction' status='final' />
              </>
            )}
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
