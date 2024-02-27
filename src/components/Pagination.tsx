import { useState } from 'react';
import { Box, Pagination, PaginationItem, styled } from '@mui/material';

interface Props {
  numberOfItems: number;
  perPage: number;
  setPaging: ({ from, to }: { from: number; to: number }) => void;
}
export function SPagination({ numberOfItems = 6, perPage, setPaging }: Props) {
  const [page, setPage] = useState(1);
  const count = Math.ceil(numberOfItems / perPage);

  const handlePageClick = (value: number) => {
    const from = (value - 1) * perPage;
    const to = value * perPage;
    setPage(value);
    setPaging({ from, to });
  };

  return (
    <>
      {count > 1 && (
        <SBox>
          <Pagination
            count={count}
            page={page}
            onChange={(_e, value) => handlePageClick(value)}
            size='large'
            renderItem={(item) => <PaginationItem slots={{ previous: Prev, next: Next }} {...item} />}
          />
        </SBox>
      )}
    </>
  );
}

const Prev = () => (
  <BtnContainer>
    {/* TODO: Icon here */}
    Previous
  </BtnContainer>
);

const Next = () => (
  <BtnContainer>
    {/* TODO: Icon here */}
    Next
  </BtnContainer>
);

const BtnContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.8rem',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 500,
  fontSize: '1.4rem',
});

const SBox = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '2rem',
  button: {
    fontSize: '1.4rem',
    fontWeight: 500,
  },
  'ul, nav': {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  'li:first-of-type': {
    marginRight: 'auto',
  },
  'li:last-of-type': {
    marginLeft: 'auto',
  },
});
