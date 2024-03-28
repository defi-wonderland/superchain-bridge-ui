import { Box, styled } from '@mui/material';
import { BridgeCard } from '~/containers';
import { NotificationChip } from './BridgeCard/NotificationChip';

import { useLogs } from '~/hooks';
export const Landing = () => {
  const { pendingTransactionCount } = useLogs();

  return (
    <Container>
      {pendingTransactionCount > 0 && <NotificationChip />}
      <BridgeCard />
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100%;
  width: 100%;
  margin: 6rem 0;

  @media (max-width: 600px) {
    padding-top: 4.2rem;
  }
`;
