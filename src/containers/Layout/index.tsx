import { styled } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { Footer } from '~/containers/Footer';
import { Header } from '~/containers/Header';

export const AppLayout = () => {
  return (
    <>
      <Header />
      <LayoutContainer>
        <Outlet />
      </LayoutContainer>
      <Footer />
    </>
  );
};

const LayoutContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 12.8rem); // temporary until design is ready
  padding: 0 8rem;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
