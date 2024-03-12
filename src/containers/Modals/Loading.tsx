import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';

import { Step } from '~/components';
import BaseModal from '~/components/BaseModal';
import { useChain, useCustomTheme, useTransactionData } from '~/hooks';
import { ModalType, TransactionStep, TransactionType } from '~/types';

export const LoadingModal = () => {
  const {
    txMetadata: { step: txStep, sourceHash, destinationHash },
    transactionType,
  } = useTransactionData();
  const { fromChain, toChain } = useChain();
  const [time, setTime] = useState(3);

  const sourceChainId = fromChain?.id;
  const destinationChainId = toChain?.id;

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
                {/* TODO: abstract and simplify this stepper */}
                <Step title='Initiate Transaction' text='Proceed in your wallet' status='loading' />
                <Step title='Processing Transaction' chainId={sourceChainId} hash={sourceHash} status='idle' />
                <Step
                  title='Relaying Transaction'
                  chainId={destinationChainId}
                  hash={destinationHash}
                  status='idle'
                  connector={false}
                />
              </>
            )}
            {txStep === TransactionStep.PROCESSING && (
              <>
                <Step title='Initiate Transaction' text='Proceed in your wallet' status='success' />
                <Step title='Processing Transaction' chainId={sourceChainId} hash={sourceHash} status='loading' />
                <Step
                  title='Relaying Transaction'
                  chainId={destinationChainId}
                  hash={destinationHash}
                  status='idle'
                  connector={false}
                />
              </>
            )}
            {txStep === TransactionStep.REPLAYING && (
              <>
                <Step title='Initiate Transaction' text='Proceed in your wallet' status='success' />
                <Step title='Processing Transaction' chainId={sourceChainId} hash={sourceHash} status='success' />
                <Step
                  title='Relaying Transaction'
                  chainId={destinationChainId}
                  hash={destinationHash}
                  status='loading'
                  connector={false}
                />
              </>
            )}
            {txStep === TransactionStep.FINALIZED && (
              <>
                <Step title='Initiate Transaction' text='Proceed in your wallet' status='success' />
                <Step title='Processing Transaction' chainId={sourceChainId} hash={sourceHash} status='success' />
                <Step title='Relaying Transaction' chainId={destinationChainId} hash={destinationHash} status='final' />
              </>
            )}
          </>
        )}

        {transactionType !== TransactionType.DEPOSIT && transactionType !== TransactionType.WITHDRAW && (
          <>
            {txStep === TransactionStep.INITIATE && (
              <>
                <Step title='Initiate Transaction' text='Proceed in your wallet' status='loading' />
                <Step
                  title='Processing Transaction'
                  chainId={sourceChainId}
                  hash={sourceHash}
                  status='idle'
                  connector={false}
                />
              </>
            )}
            {txStep === TransactionStep.PROCESSING && (
              <>
                <Step title='Initiate Transaction' text='Proceed in your wallet' status='success' />
                <Step
                  title='Processing Transaction'
                  chainId={sourceChainId}
                  hash={sourceHash}
                  status='loading'
                  connector={false}
                />
              </>
            )}

            {txStep === TransactionStep.FINALIZED && (
              <>
                <Step title='Initiate Transaction' text='Proceed in your wallet' status='success' />
                <Step title='Processing Transaction' chainId={sourceChainId} hash={sourceHash} status='final' />
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
