import { Box, styled } from '@mui/material';
import { BridgeCard } from '~/containers';

export const Landing = () => {
  return (
    <Container>
      <BridgeCard />
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin-top: 4rem;
`;
