import { Box, Skeleton, styled } from '@mui/material';

export const TableSkeleton = () => {
  return (
    <SBox>
      <Header>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Header>

      <Skeleton variant='rounded' height={52} />
      <Skeleton variant='rounded' height={52} />
      <Skeleton variant='rounded' height={52} />
      <Skeleton variant='rounded' height={52} />
      <Skeleton variant='rounded' height={52} />
      <Skeleton variant='rounded' height={52} />

      <Footer>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Footer>
    </SBox>
  );
};

const SBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 2rem;

  span {
    width: 100%;
  }
`;

const Header = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 2.4rem;
`;

const Footer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  padding: 0.85rem 8rem;
  width: 100%;
  gap: 2.4rem;
`;
