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
  ErrorModal,
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
      <ErrorModal />
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Background />
      <CssBaseline />
      <Modals />
      {/* TODO: remove when responsive is done */}
      <ResponsiveDisclaimer>
        <p>
          This website is not yet optimized for mobile devices. Please use a desktop browser for the best experience.
        </p>
      </ResponsiveDisclaimer>

      <NoScriptMessage>
        <p>This website requires JavaScript to function properly.</p>
      </NoScriptMessage>

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
  max-width: 100%;
  overflow-x: hidden;

  max-width: 120rem;
  padding: 0 4rem;
  height: 100vh;
  margin: 0 auto;

  // mediaquery
  @media (max-width: 600px) {
    padding: 0 1.2rem;
  }
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

const ResponsiveDisclaimer = styled('div')(({ theme }) => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'none',
    margin: '0 auto',
    textAlign: 'start',
    fontSize: '1.6rem',
    padding: '1rem 0.8rem 3rem',
    color: currentTheme.steel[100],
    background: `linear-gradient(180deg, ${currentTheme.steel[900]} 80%, rgba(0, 0, 0, 0) 100%)`,

    p: {
      padding: '1rem 0',
      margin: 0,
    },

    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  };
});
