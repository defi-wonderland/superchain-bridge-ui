import { useCallback, useMemo, useState } from 'react';
import { Button, styled } from '@mui/material';
import { isAddress, isHex, parseEther } from 'viem';

import { useChain, useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';
import { ModalType, TransactionType } from '~/types';

interface ConfirmButtonProps {
  isExpertMode?: boolean;
}
export const ConfirmButton = ({ isExpertMode }: ConfirmButtonProps) => {
  const { setModalOpen } = useModal();
  const { amount, selectedToken, balance, ethBalance } = useToken();
  const {
    userAddress,
    isReady,
    customTransactionType: customTransaction,
    setTransactionType,
    mint,
    value,
    to,
    data,
  } = useTransactionData();
  const { fromChain, toChain } = useChain();
  const [buttonErrorText, setButtonErrorText] = useState('');

  const isButtonDisabled = useMemo(() => {
    setButtonErrorText('');

    if (selectedToken.symbol === 'ETH') {
      if (parseEther(mint) > BigInt(ethBalance) || parseEther(value) > BigInt(ethBalance)) {
        setButtonErrorText('Insufficient balance');
        return true;
      }
    } else {
      if (parseEther(amount) > BigInt(balance)) {
        setButtonErrorText('Insufficient balance');
        return true;
      }
    }

    if (to && !isAddress(to)) {
      setButtonErrorText('Invalid target address');
      return true;
    }

    if (data && !isHex(data)) {
      setButtonErrorText('Invalid data');
      return true;
    }

    if (!isReady || !userAddress) return true;
  }, [amount, balance, data, ethBalance, isReady, mint, selectedToken.symbol, userAddress, value, to]);

  const handleReview = useCallback(() => {
    // If the selected chain has a sourceId, its because it's a L2 chain
    const isFromAnL2 = !!fromChain?.sourceId;
    const isToAnL2 = !!toChain?.sourceId;

    let openModal = ModalType.REVIEW;

    // If both chains are L2, it's a bridge transaction
    if (isFromAnL2 && isToAnL2) {
      setTransactionType(TransactionType.BRIDGE);
      // If the source chain is L2 and the destination chain is L1, it's a withdraw transaction
    } else if (isFromAnL2 && !isToAnL2) {
      setTransactionType(TransactionType.WITHDRAW);
      openModal = ModalType.WARNING;
      // If the source chain is L1 and the destination chain is L2, it's a deposit transaction
    } else if (!isFromAnL2 && isToAnL2) {
      setTransactionType(TransactionType.DEPOSIT);
      // If both chains are L1, it's a swap transaction
    } else {
      setTransactionType(TransactionType.SWAP);
    }

    setModalOpen(openModal);
  }, [fromChain, toChain, setModalOpen, setTransactionType]);

  const buttonMessage = useMemo(() => {
    if (!isButtonDisabled) return 'Review transaction';
    if (!isExpertMode) return 'Enter amount';
    if (customTransaction?.includes('force')) return 'Enter amount';
    if (customTransaction?.includes('custom') && !to) return 'Enter target address';
    return 'Enter data';
  }, [isButtonDisabled, isExpertMode, customTransaction, to]);

  return (
    <StyledButton variant='contained' fullWidth onClick={handleReview} disabled={isButtonDisabled}>
      {buttonErrorText || buttonMessage}
    </StyledButton>
  );
};

const StyledButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.ghost[400],
    color: currentTheme.steel[900],
    border: 'none',
    padding: '1rem 1.8rem',
    borderRadius: '0.8rem',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1.8rem',
    height: '6rem',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',

    '&:hover': {
      backgroundColor: currentTheme.ghost[500],
    },

    '&:disabled': {
      fontWeight: 500,
      backgroundColor: currentTheme.steel[700],
      borderColor: currentTheme.steel[700],
      color: currentTheme.steel[500],
    },
  };
});
