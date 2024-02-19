import { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import { useAccount } from 'wagmi';
import { isAddress, isHex } from 'viem';

import { useTransactionData } from '~/hooks';
import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';
import { InputField, RadioButtons } from '~/components';

export const CustomTransaction = () => {
  const { address } = useAccount();
  const { setTo, to, customTransactionType, data, setData } = useTransactionData();
  const isError = to && !isAddress(to);

  const [abi, setAbi] = useState('');
  const [isCustomData, setIsCustomData] = useState<'custom-data' | 'function'>('custom-data');

  useEffect(() => {
    if (address && isAddress(address)) setTo(address);
  }, [address, setTo]);

  return (
    <SBox>
      {customTransactionType && customTransactionType !== 'custom-tx' && (
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
            modal={false}
            placeholder='Enter contract address'
          />

          <InputField
            label='Contract ABI'
            value={abi}
            setValue={setAbi}
            modal={false}
            multiline
            placeholder='Pase contract ABI...'
          />

          <SDataContainer>
            <RadioButtons value={isCustomData} setValue={setIsCustomData} />

            <InputField
              value={data}
              setValue={setData}
              error={!!data && !isHex(data)}
              modal={false}
              placeholder='Enter custom data'
            />
          </SDataContainer>
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

const SDataContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
  width: '100%',
});
