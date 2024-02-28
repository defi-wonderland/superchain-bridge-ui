import { Box, Typography, styled } from '@mui/material';

import { formatDataNumber, formatTimestamp, truncateAddress } from '~/utils';
import { useCustomTheme, useLogs, useTokenList } from '~/hooks';
import { STooltip } from '~/components';
import { DataRow } from '~/containers';

export const TxDetails = () => {
  const { selectedLog } = useLogs();
  const { fromTokens, toTokens } = useTokenList();
  const selectedToken =
    fromTokens.find((token) => token.address === selectedLog?.localToken) ||
    toTokens.find((token) => token.address === selectedLog?.localToken);

  const formattedAmount = `${formatDataNumber(
    selectedLog?.amount?.toString() || '0',
    selectedToken?.decimals,
    2,
  )} ${selectedToken?.symbol}`;

  return (
    <LeftSection>
      <DataContainer>
        <DataRow>
          <Typography variant='body1'>Date</Typography>
          <span>{formatTimestamp(selectedLog?.timestamp.toString())}</span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Transaction type</Typography>
          <span>{selectedLog?.type}</span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Origin chain</Typography>
          <span>{selectedLog?.originChain}</span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Destination chain</Typography>
          <span>{selectedLog?.destinationChain}</span>
        </DataRow>
      </DataContainer>

      <DataContainer>
        <DataRow>
          <Typography variant='body1'>Bridge</Typography>
          <span>{selectedLog?.bridge}</span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Fees</Typography>
          <span>{selectedLog?.fees}</span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Transaction time</Typography>
          <span>{selectedLog?.transactionTime}</span>
        </DataRow>
      </DataContainer>

      <DataContainer>
        <DataRow>
          <Typography variant='body1'>From</Typography>
          <STooltip title={selectedLog?.from} className='address'>
            <span>{truncateAddress(selectedLog?.from || '0x')}</span>
          </STooltip>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>To</Typography>
          <STooltip title={selectedLog?.from} className='address'>
            <span>{truncateAddress(selectedLog?.to || '0x')}</span>
          </STooltip>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Sent</Typography>
          <span>{formattedAmount}</span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Received</Typography>
          <span>{formattedAmount}</span>
        </DataRow>
      </DataContainer>
    </LeftSection>
  );
};

export const LeftSection = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.6rem',
    width: '50%',
  };
});

export const DataContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.steel[800],
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '1.2rem',
    gap: '1.2rem',
    padding: '1.6rem',
  };
});
