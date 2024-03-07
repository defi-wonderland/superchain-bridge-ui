import { useEffect } from 'react';
import { Box, Button, TextField, styled } from '@mui/material';
import { formatUnits } from 'viem';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';
import { formatDataNumber, getUsdBalance } from '~/utils';
import { SInputLabel, TokenButton } from '~/components';
import { ModalType } from '~/types';

export const TokenSection = () => {
  const { setModalOpen } = useModal();
  const { mint, setMint, customTransactionType, value, setValue, userAddress } = useTransactionData();
  const { selectedToken, amount, balance: tokenBalance, ethBalance, price, setAmount } = useToken();

  const balance = selectedToken?.symbol === 'ETH' ? ethBalance : tokenBalance;
  const ethValue = customTransactionType ? value : mint;
  const setEthValue = customTransactionType ? setValue : setMint;

  const isEth = selectedToken?.symbol === 'ETH';
  const inputValue = isEth ? ethValue : amount;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isEth ? setEthValue(e.target.value) : setAmount(e.target.value);
  };

  const handleOpenTokenModal = () => {
    setModalOpen(ModalType.SELECT_TOKEN);
  };

  const handleMax = () => {
    isEth
      ? setEthValue(formatUnits(BigInt(ethBalance), 18))
      : setAmount(formatUnits(BigInt(balance), selectedToken?.decimals || 18));
  };

  const filterSymbols = (e: React.KeyboardEvent<HTMLInputElement>) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const usdValue = getUsdBalance(price, inputValue, selectedToken?.decimals);
  const formattedBalance = formatDataNumber(balance, selectedToken?.decimals, 2, false, true);

  // Remove scroll on input
  useEffect(() => {
    const input = document.getElementById('token-amount-input');
    input?.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    return () => {
      input?.removeEventListener('wheel', (e) => e.preventDefault());
    };
  }, []);

  return (
    <TokensContainer>
      <SInputLabel>You send</SInputLabel>

      <InputSection>
        <StyledInput
          id='token-amount-input'
          variant='standard'
          type='number'
          placeholder='0'
          value={inputValue}
          onChange={handleOnChange}
          fullWidth
          onKeyDown={filterSymbols}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TokenButton onClick={handleOpenTokenModal} selectedToken={selectedToken} />
      </InputSection>

      <BalanceSection>
        <span>{usdValue}</span>

        {userAddress && (
          <span>
            Balance: {formattedBalance}
            <MaxButton variant='text' onClick={handleMax}>
              Max
            </MaxButton>
          </span>
        )}
      </BalanceSection>
    </TokensContainer>
  );
};

const TokensContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
    width: '100%',

    gap: '0.8rem',
    border: '1px solid',
    borderColor: currentTheme.steel[700],
    backgroundColor: currentTheme.steel[800],
    borderRadius: '1.2rem',
    padding: '1.2rem 1.6rem',
    transition: currentTheme.transition,

    '&:hover': {
      borderColor: currentTheme.steel[600],
    },

    '&:has(.Mui-focused)': {
      boxShadow: '0px 0px 0px 3px #362E58', // fixed color
    },

    label: {
      fontSize: '1.4rem',
    },
  };
});

const StyledInput = styled(TextField)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    padding: '0 0.8rem 0 0',

    '& .MuiInputBase-root::after, & .MuiInputBase-root::before, & .MuiInputBase-root:hover': {
      content: 'none',
    },

    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },

    '& .MuiInputBase-input': {
      color: currentTheme.steel[100],
      fontSize: '3.2rem',
      lineHeight: 1.2,
      padding: '0',

      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    '& .MuiInputBase-input::placeholder': {
      color: currentTheme.steel[600],
      opacity: 1,
    },
  };
});

const InputSection = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  };
});

const BalanceSection = styled(InputSection)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    fontSize: '1.4rem',
    color: currentTheme.steel[400],
    fontWeight: 400,

    span: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

const MaxButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.ghost[400],
    fontSize: '1.4rem',
    fontWeight: 600,
    textTransform: 'none',
    padding: '0',
    marginLeft: '0.8rem',
    minWidth: 'fit-content',
  };
});
