import { CssBaseline, styled } from '@mui/material';
import { ConfirmModal, Header, LoadingModal, ReviewModal, SuccessModal } from '~/containers';
import { Background } from '~/containers';

export const Modals = () => {
  return (
    <>
      {/* Add all modals here... */}
      <ConfirmModal />
      <ReviewModal />
      <LoadingModal />
      <SuccessModal />
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Background />
      <CssBaseline />
      <Modals />
      <Header />
      <MainContent>{children}</MainContent>
    </>
  );
}

const MainContent = styled('main')`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 12.8rem); // temporary until design is ready
  padding: 0 8rem;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
