import { useState } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Paper } from '@mui/material';
import { isHex } from 'viem';

import { useModal, useToken, useTransactionData } from '~/hooks';
import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';
import { InputField } from '~/components';
import { ModalType, TransactionType } from '~/types';

export const BridgeCard = () => {
  const { setModalOpen } = useModal();
  const { amount, selectedToken, setSelectedToken } = useToken();
  const { mint, data, setData, transactionType, isForceTransaction, setIsForceTransaction, to, setTo } =
    useTransactionData();

  const [isAdvanceMode, setIsAdvanceMode] = useState(false);

  const handleReview = () => {
    setModalOpen(ModalType.REVIEW);
  };

  const handleAdvanceMode = () => {
    setSelectedToken(undefined);
    setIsAdvanceMode(!isAdvanceMode);
  };

  const isButtonDisabled =
    (selectedToken?.symbol === 'ETH' && !mint) ||
    (selectedToken && selectedToken?.symbol !== 'ETH' && !amount) ||
    (!!data && !isHex(data));

  return (
    // temporary inline-style
    <Paper elevation={3} sx={{ minWidth: '32rem' }}>
      <CardContent>
        <Typography variant='h5'>Bridge</Typography>
        <br />

        <ChainSection />
        <br />
        <br />

        {transactionType === TransactionType.DEPOSIT && (
          <Button onClick={() => setIsForceTransaction(!isForceTransaction)} fullWidth>
            Force transaction ({isForceTransaction ? 'On' : 'Off'})
          </Button>
        )}

        <InputField label='To' value={to} setValue={setTo} error={!!to && !isHex(to)} />
        <br />

        {!isAdvanceMode && <TokenSection />}

        {isAdvanceMode && (
          <>
            <InputField label='Custom message' value={data} setValue={setData} error={!!data && !isHex(data)} />
            {/* Temporary spacing */}
            <br />
            <br />
            <br />
            <br />
          </>
        )}

        <Button variant='contained' color='primary' fullWidth onClick={handleReview} disabled={isButtonDisabled}>
          Review Transaction
        </Button>

        <Button onClick={handleAdvanceMode} fullWidth>
          {isAdvanceMode ? 'Basic Mode' : 'Advance Mode'}
        </Button>
      </CardContent>
    </Paper>
  );
};
