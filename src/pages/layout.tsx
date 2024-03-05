import { Box, CssBaseline, styled } from '@mui/material';
import {
  ConfirmModal,
  Footer,
  Header,
  LoadingModal,
  ReviewModal,
  SuccessModal,
  SettingsModal,
  TokensModal,
  TargetAddress,
  BridgeModal,
  WarningModal,
} from '~/containers';
import { Background } from '~/containers';
import { useCustomTheme } from '~/hooks';

export const Modals = () => {
  return (
    <>
      {/* Add all modals here... */}
      <ConfirmModal />
      <ReviewModal />
      <LoadingModal />
      <SuccessModal />
      <SettingsModal />
      <TokensModal />
      <TargetAddress />
      <BridgeModal />
      <WarningModal />
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NoScriptMessage>
        <p>This website requires JavaScript to function properly.</p>
      </NoScriptMessage>
      <Background />
      <CssBaseline />
      <Modals />
      <MainContent>
        <Header />
        {children}
        <Footer />
      </MainContent>
    </>
  );
}

const MainContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 100%;

  max-width: 120rem;
  padding: 0 4rem;
  height: 100vh;
  margin: 0 auto;
`;

const NoScriptMessage = styled('noscript')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    margin: '0 auto',
    width: '100%',
    textAlign: 'center',
    color: currentTheme.steel[100],
    fontSize: '1.6rem',
    padding: '1rem 0',
    Background: currentTheme.steel[900],
    p: {
      padding: '1rem 0',
      margin: 0,
    },
  };
});
