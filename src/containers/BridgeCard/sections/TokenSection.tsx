import { Box } from '@mui/material';
import { formatUnits } from 'viem';

import { useModal, useToken, useTransactionData } from '~/hooks';
import { InputField } from '~/components';
import { ModalType } from '~/types';

export const TokenSection = () => {
  const { setModalOpen } = useModal();
  const { mint, setMint, isForceTransaction, value, setValue } = useTransactionData();
  const { selectedToken, amount, balance: tokenBalance, ethBalance, allowance, setAmount } = useToken();

  const balance = selectedToken?.symbol === 'ETH' ? ethBalance : tokenBalance;
  const ethValue = isForceTransaction ? value : mint;
  const setEthValue = isForceTransaction ? setValue : setMint;

  return (
    <Box>
      <button onClick={() => setModalOpen(ModalType.SELECT_TOKEN)}>open tokens modal</button>

      <br />
      {selectedToken?.symbol === 'ETH' && <InputField label='ETH Amount' value={ethValue} setValue={setEthValue} />}

      {selectedToken && selectedToken?.symbol !== 'ETH' && (
        <InputField label='Token Amount' value={amount} setValue={setAmount} />
      )}

      <p>Balance: {formatUnits(BigInt(balance), selectedToken?.decimals || 18)}</p>
      <p>Allowance: {formatUnits(BigInt(allowance), selectedToken?.decimals || 18)}</p>
    </Box>
  );
};
