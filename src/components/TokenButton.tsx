import { Button, styled } from '@mui/material';
import Image from 'next/image';

import chevronDown from '~/assets/icons/chevron-down.svg';
import { useCustomTheme } from '~/hooks';
import { TokenData } from '~/types';

interface TokenButtonProps {
  onClick: () => void;
  selectedToken: TokenData;
}

export const TokenButton = ({ onClick, selectedToken }: TokenButtonProps) => {
  return (
    <StyledButton onClick={onClick} endIcon={<Image src={chevronDown} alt='chevrown down' width={16} height={16} />}>
      <Image src={selectedToken?.logoURI} alt={selectedToken?.name} className='token-image' width={32} height={32} />
      {selectedToken?.symbol}
    </StyledButton>
  );
};

const StyledButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    transition: currentTheme.transition,
    fontSize: '1.8rem',
    color: currentTheme.steel[100],
    borderRadius: '5.8rem',
    border: `1px solid ${currentTheme.steel[700]}`,
    backgroundColor: currentTheme.steel[900],
    padding: '0.4rem 0.8rem 0.4rem 0.4rem',
    boxShadow: '0 0.1rem 0.2rem 0 rgba(16, 24, 40, 0.05)',
    gap: '0.4rem',
    display: 'flex',
    minWidth: 'fit-content',

    '.MuiButton-endIcon': {
      marginLeft: '0.2rem',
      marginRight: '0',
    },

    '.token-image': {
      borderRadius: '50%',
      width: '3.2rem',
      height: '3.2rem',
      marginRight: '0.6rem',
    },

    '&:hover': {
      borderColor: currentTheme.steel[600],
      backgroundColor: currentTheme.steel[900],
    },
  };
});
