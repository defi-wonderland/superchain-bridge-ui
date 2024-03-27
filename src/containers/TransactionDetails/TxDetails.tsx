import { Box, Typography, styled } from '@mui/material';
import Image from 'next/image';

import clockIcon from '~/assets/icons/clock.svg';
import gasIcon from '~/assets/icons/gas.svg';
import copyIcon from '~/assets/icons/copy.svg';
import copyCheckIcon from '~/assets/icons/copy-check.svg';

import { chainData, formatDataNumber, formatTimestamp, supportedChains, truncateAddress } from '~/utils';
import { useCustomTheme, useLogs, useTokenList, useCopyToClipboard } from '~/hooks';
import { STooltip } from '~/components';
import { DataRow } from '~/containers';

export const TxDetails = () => {
  const { selectedLog } = useLogs();
  const { fromTokens, toTokens } = useTokenList();
  const [copiedStates, copy] = useCopyToClipboard();

  const selectedToken =
    fromTokens.find((token) => token.address === selectedLog?.localToken) ||
    toTokens.find((token) => token.address === selectedLog?.localToken);

  const formattedAmount = `${formatDataNumber(
    selectedLog?.amount?.toString() || '0',
    selectedToken?.decimals,
    2,
  )} ${selectedToken?.symbol}`;

  const originChainLogo = chainData[selectedLog?.originChain || 0]?.logo;
  const destinationChainLogo = chainData[selectedLog?.destinationChain || 0]?.logo;
  const originChainName = supportedChains.find((chain) => chain.id === selectedLog?.originChain)?.name;
  const destinationChainName = supportedChains.find((chain) => chain.id === selectedLog?.destinationChain)?.name;

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
          <span>
            <Image src={originChainLogo} alt='' width={20} height={20} />
            {originChainName}
          </span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Destination chain</Typography>
          <span>
            <Image src={destinationChainLogo} alt='' width={20} height={20} />
            {destinationChainName}
          </span>
        </DataRow>
      </DataContainer>

      <DataContainer>
        <DataRow>
          <Typography variant='body1'>Bridge</Typography>
          <span>
            <Image src={chainData[selectedLog?.destinationChain || 0]?.logo} alt='' width={20} height={20} />
            {selectedLog?.bridge}
          </span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Fees</Typography>

          <span>
            <Image src={gasIcon} alt='fees' />
            {/* {selectedLog?.fees} */} -
          </span>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>Transaction time</Typography>
          <span>
            <Image src={clockIcon} alt='transaction time' />
            {/* {selectedLog?.transactionTime} */} -
          </span>
        </DataRow>
      </DataContainer>

      <DataContainer>
        <DataRow>
          <Typography variant='body1'>From</Typography>

          <Box className='address-container'>
            <STooltip title={copiedStates['from'] === selectedLog?.from ? 'Copied!' : 'Copy to clipboard'}>
              <Box onClick={() => copy('from', selectedLog?.from || '0x')} className='address'>
                <span>{truncateAddress(selectedLog?.from || '0x')}</span>
                <Image
                  src={copiedStates['from'] === selectedLog?.from ? copyCheckIcon : copyIcon}
                  alt='Copy to clipboard'
                  className='copy-to-clipboard'
                />
              </Box>
            </STooltip>
          </Box>
        </DataRow>

        <DataRow>
          <Typography variant='body1'>To</Typography>
          <Box className='address-container'>
            <STooltip title={copiedStates['to'] === selectedLog?.to ? 'Copied!' : 'Copy to clipboard'}>
              <Box onClick={() => copy('to', selectedLog?.to || '0x')} className='address'>
                <span>{truncateAddress(selectedLog?.to || '0x')}</span>
                <Image
                  src={copiedStates['to'] === selectedLog?.to ? copyCheckIcon : copyIcon}
                  alt='Copy to clipboard'
                  className='copy-to-clipboard'
                />
              </Box>
            </STooltip>
          </Box>
        </DataRow>

        {selectedLog?.data && (
          <>
            <DataRow>
              <Typography variant='body1'>Custom data</Typography>
              <span>{selectedLog.data.length > 10 ? truncateAddress(selectedLog.data) : selectedLog.data}</span>
            </DataRow>
          </>
        )}

        {!selectedLog?.data && (
          <>
            <DataRow>
              <Typography variant='body1'>Sent</Typography>
              <span>
                <Image src={selectedToken?.logoURI || ''} alt={selectedToken?.symbol || ''} width={20} height={20} />
                {formattedAmount}
              </span>
            </DataRow>

            <DataRow>
              <Typography variant='body1'>Received</Typography>
              <span>
                <Image src={selectedToken?.logoURI || ''} alt={selectedToken?.symbol || ''} width={20} height={20} />
                {formattedAmount}
              </span>
            </DataRow>
          </>
        )}
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

    '@media (max-width: 600px)': {
      width: '100%',
    },
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
