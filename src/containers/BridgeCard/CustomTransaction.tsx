import { useState } from 'react';
import { Box, styled } from '@mui/material';
import { AbiParameter, isAddress, isHex } from 'viem';

import { useFunctionMethod, useTransactionData } from '~/hooks';
import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';
import { InputField, RadioButtons, FunctionSelect } from '~/components';

export const CustomTransaction = () => {
  const { setTo, to, customTransactionType, data, setData } = useTransactionData();
  const [isCustomData, setIsCustomData] = useState<'custom-data' | 'function'>('function');
  const { abi, setAbi, handleSetSelectedFunction, functions, selectedFunction, functionParams, setFunctionParams } =
    useFunctionMethod();

  const isError = to && !isAddress(to);

  const handleSetIsCustomData = (val: 'custom-data' | 'function') => {
    setIsCustomData(val);
    setFunctionParams(undefined);
    setData('');
  };

  return (
    <SBox>
      {customTransactionType && customTransactionType !== 'custom-tx' && (
        <>
          <ChainSection />
          <TokenSection />
          <InputField
            label='To'
            value={to}
            setValue={setTo}
            error={!!isError}
            placeholder='Receiver address'
            modal={false}
          />
        </>
      )}

      {customTransactionType === 'custom-tx' && (
        <>
          <ChainSection />

          <InputField
            label='Target address'
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
            placeholder='Paste contract ABI...'
          />

          <SDataContainer>
            <RadioButtons value={isCustomData} setValue={handleSetIsCustomData} />

            {isCustomData === 'custom-data' && (
              <InputField
                value={data}
                setValue={setData}
                error={!!data && !isHex(data)}
                modal={false}
                placeholder='Enter custom data'
              />
            )}

            {isCustomData === 'function' && (
              <>
                <FunctionSelect
                  list={functions}
                  value={selectedFunction}
                  setValue={handleSetSelectedFunction}
                  disabled={!selectedFunction}
                />

                {selectedFunction &&
                  selectedFunction.inputs.map((input: AbiParameter, index) => (
                    <InputField
                      key={input.type + input?.name + index}
                      label={input.name}
                      value={functionParams?.[input.name || ''] || ''}
                      setValue={(val) => setFunctionParams({ ...functionParams, [input.name || '']: val })}
                      modal={false}
                      placeholder={input?.internalType || input.type}
                    />
                  ))}
              </>
            )}
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
