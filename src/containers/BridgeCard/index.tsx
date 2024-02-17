import { useMemo, useState } from 'react';
import { Button, styled } from '@mui/material';

import { useCustomTheme, useModal, useTransactionData } from '~/hooks';

import { ModalType } from '~/types';
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
  } = useTransactionData();
  const [isExpertMode, setIsExpertMode] = useState(false);

  const handleReview = () => {
    setModalOpen(ModalType.REVIEW);
  };

  const isButtonDisabled = !isReady;

  const disableMessage = useMemo(() => {
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

      <StyledButton variant='contained' fullWidth onClick={handleReview} disabled={isButtonDisabled}>
        {disableMessage}
      </StyledButton>
    </MainCardContainer>
  );
};

const MainCardContainer = styled('main')(() => {
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
