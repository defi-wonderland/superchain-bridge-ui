import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, styled } from '@mui/material';
import { isHex } from 'viem';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';
import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';
import { InputField } from '~/components';
import { ModalType, TransactionType } from '~/types';

export const BridgeCard = () => {
  const { setModalOpen } = useModal();
  const { amount, selectedToken, setSelectedToken } = useToken();
  const { mint, data, setData, transactionType, isForceTransaction, setIsForceTransaction } = useTransactionData();

  const [isAdvanceMode, setIsAdvanceMode] = useState(false);

  const handleReview = () => {
    setModalOpen(ModalType.REVIEW);
  };

  const handleAdvanceMode = () => {
    setSelectedToken(undefined);
    setIsAdvanceMode(!isAdvanceMode);
  };

  const openSelectAccountModal = () => {
    setModalOpen(ModalType.SELECT_ACCOUNT);
  };

  const isButtonDisabled =
    (selectedToken?.symbol === 'ETH' && !mint) ||
    (selectedToken && selectedToken?.symbol !== 'ETH' && !amount) ||
    (!!data && !isHex(data));

  return (
    <MainCardContainer>
      <Typography variant='h5'>Superchain Bridge</Typography>

      <ChainSection />

      {transactionType === TransactionType.DEPOSIT && (
        <Button onClick={() => setIsForceTransaction(!isForceTransaction)} fullWidth>
          Force transaction ({isForceTransaction ? 'On' : 'Off'})
        </Button>
      )}

      {!isAdvanceMode && <TokenSection />}

      {isAdvanceMode && (
        <>
          <InputField label='Custom message' value={data} setValue={setData} error={!!data && !isHex(data)} />
          {/* Temporary spacing */}
        </>
      )}
      <button onClick={openSelectAccountModal}>Select account</button>

      <Button variant='contained' color='primary' fullWidth onClick={handleReview} disabled={isButtonDisabled}>
        Review Transaction
      </Button>

      <Button onClick={handleAdvanceMode} fullWidth>
        {isAdvanceMode ? 'Basic Mode' : 'Advance Mode'}
      </Button>
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
