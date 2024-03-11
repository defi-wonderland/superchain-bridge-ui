import { useState } from 'react';
import { styled } from '@mui/material';

import { useCustomTheme, useTransactionData } from '~/hooks';
import { Connect } from '~/components';
import { BasicMode } from './BasicMode';
import { ExpertMode } from './ExpertMode';
import { CardHeader } from './CardHeader';
import { CustomTransaction } from './CustomTransaction';
import { ConfirmButton } from './ConfirmButton';

export const BridgeCard = () => {
  const {
    userAddress,
    customTransactionType: customTransaction,
    setCustomTransactionType: setCustomTransaction,
  } = useTransactionData();
  const [isExpertMode, setIsExpertMode] = useState(false);

  const showPrimaryButton = (isExpertMode && customTransaction) || !isExpertMode;

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

      {showPrimaryButton && (
        <>
          {!userAddress && <SConnectButton fullWidth />}
          {userAddress && <ConfirmButton isExpertMode={isExpertMode} />}
        </>
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

const SConnectButton = styled(Connect)(() => {
  return {
    padding: '1rem 1.8rem',
    borderRadius: '0.8rem',
    textTransform: 'capitalize',
    fontWeight: 500,
    fontSize: '1.8rem',
    height: '6rem',
  };
});
