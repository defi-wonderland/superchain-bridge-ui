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
  justify-content: start;
  height: 100%;
  width: 100%;
  margin: 6rem 0;
`;
