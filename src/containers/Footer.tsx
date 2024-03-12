import { Box, styled } from '@mui/material';
import Link from 'next/link';

import { MadeByWonderland } from '~/components';
import { useCustomTheme } from '~/hooks';

export const Footer = () => {
  return (
    <FooterContainer>
      <RightSide>
        {/* <Link href='/'>Legal</Link> */}

        <Link href='https://docs.optimism.io/stack/explainer' target='_blank'>
          Docs
        </Link>

        <Link href='https://github.com/defi-wonderland/superchain-bridge-ui' target='_blank'>
          Github
        </Link>
      </RightSide>

      <Box>
        <MadeByWonderland />
      </Box>
    </FooterContainer>
  );
};

const FooterContainer = styled('footer')`
  display: flex;
  height: auto;
  align-items: center;
  padding: 3.2rem 0 4.8rem 0;
  justify-content: space-between;
  margin-top: auto;
  width: 100%;

  @media (max-width: 600px) {
    display: flex;
    margin-top: 16rem;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    padding: 2rem 1.6rem 8rem;
  }
`;

const RightSide = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    gap: '2.7rem',
    alignItems: 'center',
    justifyContent: 'center',
    a: {
      color: currentTheme.steel[500],
      fontSize: '1.2rem',
      '&:hover': {
        transition: currentTheme.transition,
        color: currentTheme.steel[100],
      },
    },

    '@media (max-width: 600px)': {
      marginBottom: '3.2rem',
    },
  };
});
