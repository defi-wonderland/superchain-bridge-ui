import { useMemo, useState } from 'react';
import { Button, styled } from '@mui/material';
import { isHex } from 'viem';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';

import { ModalType } from '~/types';
import { BasicMode } from './BasicMode';
import { ExpertMode } from './ExpertMode';
import { CardHeader } from './CardHeader';

export const BridgeCard = () => {
  const { setModalOpen } = useModal();
  const { amount, selectedToken } = useToken();
  const {
    mint,
    data,
    customTransactionType: customTransaction,
    setCustomTransactionType: setCustomTransaction,
  } = useTransactionData();
  const [isExpertMode, setIsExpertMode] = useState(false);

  const handleReview = () => {
    setModalOpen(ModalType.REVIEW);
  };

  const isButtonDisabled =
    (selectedToken?.symbol === 'ETH' && !Number(mint)) ||
    (selectedToken && selectedToken?.symbol !== 'ETH' && !Number(amount)) ||
    (!!data && !isHex(data));

  const disableMessage = useMemo(() => {
    if (!isButtonDisabled) return 'Review transaction';
    if (!isExpertMode) return 'Enter amount';
    if (!customTransaction) return 'Select transaction type';

    return 'Enter data';
  }, [isButtonDisabled, isExpertMode, customTransaction]);

  return (
    <MainCardContainer>
      <CardHeader
        isExpertMode={isExpertMode}
        setIsExpertMode={setIsExpertMode}
        customTransaction={!!customTransaction}
        setCustomTransaction={setCustomTransaction}
      />

      {!isExpertMode && !customTransaction && <BasicMode />}

      {isExpertMode && !customTransaction && <ExpertMode setCustomTransaction={setCustomTransaction} />}

      {customTransaction && <>test</>}

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
