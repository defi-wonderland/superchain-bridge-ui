import { ChainProvider } from './ChainProvider';
import { CustomClientProvider } from './CustomClientProvider';
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
              <CustomClientProvider>
                <TokenProvider>
                  <TransactionDataProvider>
                    <LogsProvider>{children}</LogsProvider>
                  </TransactionDataProvider>
                </TokenProvider>
              </CustomClientProvider>
            </ChainProvider>
          </Web3ModalProvider>
        </StateProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};
