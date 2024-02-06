import { ChainProvider } from './ChainProvider';
import { LogsProvider } from './LogsProvider';
import { ModalProvider } from './ModalProvider';
import { StateProvider } from './StateProvider';
import { ThemeProvider } from './ThemeProvider';
import { TokenProvider } from './TokenProvider';
import { TransactionDataProvider } from './TransactionDataProvider';
import { Web3ModalProvider } from './Web3ModalProvider';

export const Providers = ({ children }: { children: React.ReactElement }) => {
  return (
    <ThemeProvider>
      <ModalProvider>
        <StateProvider>
          <Web3ModalProvider>
            <ChainProvider>
              <TokenProvider>
                <TransactionDataProvider>
                  <LogsProvider>{children}</LogsProvider>
                </TransactionDataProvider>
              </TokenProvider>
            </ChainProvider>
          </Web3ModalProvider>
        </StateProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};
