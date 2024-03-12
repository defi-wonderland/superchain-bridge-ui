import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { PrimaryButton } from './Buttons';
import { truncateAddress } from '~/utils';
import { ButtonProps, styled } from '@mui/material';
import { useCustomTheme } from '~/hooks';

export const Connect = ({ ...props }: ButtonProps) => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const handleClick = () => {
    if (address && openAccountModal) {
      openAccountModal();
    } else if (openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <SConnectButton onClick={handleClick} className={address ? 'connected' : ''} {...props}>
      {!address && 'Connect Wallet'}
      {address && truncateAddress(address)}
    </SConnectButton>
  );
};

const SConnectButton = styled(PrimaryButton)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    padding: '1rem 1.6rem',
    borderRadius: '1.2rem',
    color: currentTheme.ghost[300],
    backgroundColor: currentTheme.ghost[800],
    boxShadow: '0 0.1rem 0.2rem 0 rgba(16, 24, 40, 0.05)',
    fontSize: '1.6rem',
    lineHeight: '2.4rem',
    fontWeight: 500,

    '&:hover': {
      backgroundColor: currentTheme.ghost[700],
    },

    '&.connected': {
      color: currentTheme.steel[50],
      backgroundColor: currentTheme.steel[800],
    },

    '&.connected:hover': {
      backgroundColor: currentTheme.steel[700],
    },
  };
});
