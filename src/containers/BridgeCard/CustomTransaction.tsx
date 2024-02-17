import { useEffect } from 'react';
import { Box, styled } from '@mui/material';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';

import { useTransactionData } from '~/hooks';
import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';
import { InputField } from '~/components';

export const CustomTransaction = () => {
  const { address } = useAccount();
  const { setTo, to, customTransactionType } = useTransactionData();
  const isError = to && !isAddress(to);

  useEffect(() => {
    if (address && isAddress(address)) setTo(address);
  }, [address, setTo, to]);

  return (
    <SBox>
      {(customTransactionType === 'force-withdrawal' || customTransactionType === 'force-transfer') && (
        <>
          <ChainSection />
          <TokenSection />
          <InputField label='To address' value={to} setValue={setTo} error={!!isError} placeholder='' modal={false} />
        </>
      )}

      {customTransactionType === 'custom-tx' && (
        <>
          <ChainSection />
          <InputField
            label='Contract address'
            value={to}
            setValue={setTo}
            error={!!isError}
            placeholder=''
            modal={false}
          />
        </>
      )}
    </SBox>
  );
};

const SBox = styled(Box)({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  gap: '2.4rem',
});
