import { styled } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import arrowBackIcon from '~/assets/icons/arrow-back.svg';

import { useChain, useCustomTheme } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';

export const BackButton = () => {
  const { fromChain } = useChain();
  const chainPath = replaceSpacesWithHyphens(fromChain?.name || '');

  return (
    <SBackButton
      href={{
        pathname: '/[chain]/history',
        query: { chain: chainPath },
      }}
    >
      <Image src={arrowBackIcon} alt='Back' />
      Back
    </SBackButton>
  );
};

const SBackButton = styled(Link)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',

    transition: currentTheme.transition,
    color: currentTheme.ghost[400],
    fontSize: '1.6rem',
    fontWeight: 500,
    lineHeight: '2.4rem' /* 150% */,
    textTransform: 'none',
    gap: '0.8rem',

    '&:hover': {
      opacity: 0.8,
    },
  };
});
