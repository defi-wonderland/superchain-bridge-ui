import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Connect = () => {
  return <ConnectButton accountStatus='address' showBalance={false} chainStatus='icon' />;
};
