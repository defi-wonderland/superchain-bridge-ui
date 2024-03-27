import { Box, Button, styled } from '@mui/material';
import { useAccount, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import Image from 'next/image';

import historyIcon from '~/assets/icons/clock-rewind.svg';
import settingsIcon from '~/assets/icons/settings.svg';
import addressIcon from '~/assets/icons/address.svg';
import disconnectIcon from '~/assets/icons/disconnect.svg';
import checkIcon from '~/assets/icons/check.svg';

import { Connect } from '~/components';
import { useChain, useCopyToClipboard, useCustomTheme, useModal } from '~/hooks';
import { replaceSpacesWithHyphens, truncateAddress } from '~/utils';
import { ModalType } from '~/types';

interface MobileMenuProps {
  closeMenu: () => void;
}
export const MobileMenu = ({ closeMenu }: MobileMenuProps) => {
  const router = useRouter();
  const { address } = useAccount();
  const disconnect = useDisconnect();
  const { setModalOpen } = useModal();
  const [copiedStates, copy] = useCopyToClipboard();
  const { toChain } = useChain();
  const chainPath = replaceSpacesWithHyphens(toChain?.name || '');

  const openSettings = () => {
    closeMenu();
    setModalOpen(ModalType.SETTINGS);
  };

  const handleDisconnect = () => disconnect.disconnectAsync();

  const handleNavigate = () => {
    closeMenu();
    router.push({
      pathname: '/[chain]/account/[account]',
      query: { chain: chainPath, account: address },
    });
  };

  const handleCopyAddress = () => {
    copy('address', address || '');
  };

  return (
    <MobileMenuContainer role='menu'>
      {address && (
        <>
          <SBox>
            <MenuButton
              variant='text'
              onClick={handleCopyAddress}
              startIcon={
                <SIcon src={address === copiedStates['address'] ? checkIcon : addressIcon} alt='Copy address' />
              }
            >
              {truncateAddress(address || '')}
            </MenuButton>
          </SBox>

          <SBox>
            <MenuButton
              variant='text'
              onClick={handleNavigate}
              startIcon={<SIcon src={historyIcon} alt='Account History' />}
            >
              Account history
            </MenuButton>
          </SBox>

          <SBox>
            <MenuButton
              variant='text'
              onClick={handleDisconnect}
              startIcon={<SIcon src={disconnectIcon} alt='Disconnect' />}
            >
              Disconnect
            </MenuButton>
          </SBox>
        </>
      )}

      <SBox>
        <MenuButton variant='text' onClick={openSettings} startIcon={<SIcon src={settingsIcon} alt='Settings' />}>
          Settings
        </MenuButton>
      </SBox>

      {!address && (
        <SBox>
          <Connect fullWidth />
        </SBox>
      )}
    </MobileMenuContainer>
  );
};

const MobileMenuContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    position: 'fixed',
    paddingTop: '1.6rem',
    paddingBottom: '1.2rem',
    top: '6rem',
    right: '4.8rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: currentTheme.steel[900],
    borderBottom: currentTheme.mainCardBorder,
    width: '100%',
    zIndex: -1,

    '@media (max-width: 600px)': {
      right: '0',

      animation: 'fadeIn 0.2s ease',
      '@keyframes fadeIn': {
        '0%': {
          transform: 'translateY(-100%)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1,
        },
      },
    },
  };
});

const SBox = styled(Box)(() => {
  return {
    width: '100%',
    padding: '0.8rem 1.6rem',
  };
});

const MenuButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[200],
    fontSize: '1.6rem',
    fontWeight: 500,
    lineHeight: '2.4rem',
    textAlign: 'left',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'start',
    textTransform: 'none',
    padding: '0.8rem',
    gap: '0.4rem',
  };
});

const SIcon = styled(Image)({
  height: '2.4rem',
  width: '2.4rem',
});
