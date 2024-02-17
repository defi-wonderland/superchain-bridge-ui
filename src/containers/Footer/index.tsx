import { Box, styled } from '@mui/material';
import Link from 'next/link';

import { MadeByWonderland } from '~/components';
import { useCustomTheme } from '~/hooks';

export const Footer = () => {
  return (
    <FooterContainer>
      <RightSide>
        <Link href='/'>Legal</Link>
        <Link href='/'>Docs</Link>
      </RightSide>

      <Box>
        <MadeByWonderland />
      </Box>
    </FooterContainer>
  );
};

const FooterContainer = styled('footer')`
  display: flex;
  height: 6.4rem;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

const RightSide = styled(Box)(({ theme }) => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    gap: '2.7rem',
    alignItems: 'center',
    justifyContent: 'center',
    a: {
      color: currentTheme.steel[500],
      fontSize: theme.typography.body1.fontSize,
      '&:hover': {
        transition: currentTheme.transition,
        color: currentTheme.steel[100],
      },
    },
  };
});
