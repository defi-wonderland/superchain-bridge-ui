import { useAccount } from 'wagmi';
import { Account } from './Account';
import { WalletOptions } from './WalletOptions';

export function Connect() {
  const { isConnected } = useAccount();
  return (
    <div className='buttons'>
      {!isConnected && <WalletOptions />}
      {isConnected && <Account />}
    </div>
  );
}
