import { ChainProvider } from './ChainProvider';
import { ModalProvider } from './ModalProvider';
import { StateProvider } from './StateProvider';
import { ThemeProvider } from './ThemeProvider';
import { Web3ModalProvider } from './Web3ModalProvider';

export const Providers = ({ children }: { children: React.ReactElement }) => {
  return (
    <ThemeProvider>
      <ModalProvider>
        <StateProvider>
          <Web3ModalProvider>
            <ChainProvider>{children}</ChainProvider>
          </Web3ModalProvider>
        </StateProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};
