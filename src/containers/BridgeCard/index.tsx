import { useMemo, useState } from 'react';
import { Button, styled } from '@mui/material';

import { useChain, useCustomTheme, useModal, useTransactionData } from '~/hooks';

import { ModalType, TransactionType } from '~/types';
import { BasicMode } from './BasicMode';
import { ExpertMode } from './ExpertMode';
import { CardHeader } from './CardHeader';
import { CustomTransaction } from './CustomTransaction';

export const BridgeCard = () => {
  const { setModalOpen } = useModal();
  const {
    isReady,
    customTransactionType: customTransaction,
    setCustomTransactionType: setCustomTransaction,
    setTransactionType,
  } = useTransactionData();
  const [isExpertMode, setIsExpertMode] = useState(false);
  const { fromChain, toChain } = useChain();

  const handleReview = () => {
    // If the selected chain has a sourceId, its because it's a L2 chain
    const isFromAnL2 = !!fromChain?.sourceId;
    const isToAnL2 = !!toChain?.sourceId;

    // If both chains are L2, it's a bridge transaction
    if (isFromAnL2 && isToAnL2) {
      setTransactionType(TransactionType.BRIDGE);
      // If the source chain is L2 and the destination chain is L1, it's a withdraw transaction
    } else if (isFromAnL2 && !isToAnL2) {
      setTransactionType(TransactionType.WITHDRAW);
      // If the source chain is L1 and the destination chain is L2, it's a deposit transaction
    } else if (!isFromAnL2 && isToAnL2) {
      setTransactionType(TransactionType.DEPOSIT);
      // If both chains are L1, it's a swap transaction
    } else {
      setTransactionType(TransactionType.SWAP);
    }

    setModalOpen(ModalType.REVIEW);
  };

  const isButtonDisabled = !isReady;

  const buttonMessage = useMemo(() => {
    if (!isButtonDisabled) return 'Review transaction';
    if (!isExpertMode) return 'Enter amount';
    if (!customTransaction) return 'Select transaction type';
    if (customTransaction.includes('force')) return 'Enter amount';

    return 'Enter data';
  }, [isButtonDisabled, isExpertMode, customTransaction]);

  return (
    <MainCardContainer>
      <CardHeader
        isExpertMode={isExpertMode}
        setIsExpertMode={setIsExpertMode}
        customTransaction={customTransaction}
        setCustomTransaction={setCustomTransaction}
      />

      {!isExpertMode && !customTransaction && <BasicMode />}

      {isExpertMode && !customTransaction && <ExpertMode setCustomTransaction={setCustomTransaction} />}

      {customTransaction && <CustomTransaction />}

      {((isExpertMode && customTransaction) || !isExpertMode) && (
        <StyledButton variant='contained' fullWidth onClick={handleReview} disabled={isButtonDisabled}>
          {buttonMessage}
        </StyledButton>
      )}
    </MainCardContainer>
  );
};

export const MainCardContainer = styled('main')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.steel[900],
    boxShadow: currentTheme.mainCardBoxShadow,
    borderRadius: currentTheme.borderRadius,
    border: currentTheme.mainCardBorder,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    padding: '2rem 2.4rem 3.2rem 2.4rem',
    width: '51.2rem',
    gap: '2.4rem',
  };
});

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
    fontSize: '1.8rem',
    height: '6rem',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',

    '&:hover': {
      backgroundColor: currentTheme.ghost[500],
    },

    '&:disabled': {
      fontWeight: 500,
      backgroundColor: currentTheme.steel[700],
      borderColor: currentTheme.steel[700],
      color: currentTheme.steel[500],
    },
  };
});
