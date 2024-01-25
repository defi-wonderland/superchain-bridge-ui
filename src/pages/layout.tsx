import { styled } from '@mui/material';
import { ConfirmModal, Header } from '~/containers';

export const Modals = () => {
  return (
    <>
      {/* Add all modals here... */}
      <ConfirmModal />
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
