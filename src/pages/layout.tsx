import { CssBaseline, styled } from '@mui/material';
import {
  ConfirmModal,
  Footer,
  Header,
  LoadingModal,
  ReviewModal,
  SuccessModal,
  SettingsModal,
  TokensModal,
} from '~/containers';
import { Background } from '~/containers';

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
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
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

const MainContent = styled('main')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  max-width: 120rem;
  padding: 0 4rem;
  height: 100vh;
  margin: 0 auto;
`;
