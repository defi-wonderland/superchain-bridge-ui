import { Chain } from 'viem';
import { Box, IconButton, styled } from '@mui/material';
import Image from 'next/image';

import arrowRightIcon from '~/assets/icons/arrow-right.svg';

import { useChain, useCustomTheme, useToken } from '~/hooks';
import { ChainSelect } from '~/components';

export const ChainSection = () => {
  const { fromList, toList, setFromChain, setToChain, fromChain, toChain, switchChains } = useChain();
  const { setSelectedToken } = useToken();

  const handleFrom = async (chain: Chain) => {
    try {
      setFromChain(chain);

      // Reset token when chain is changed
      setSelectedToken(undefined);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleTo = async (chain: Chain) => {
    setToChain(chain);
  };

  return (
    <ChainSectionContainer>
      <ChainSelect label='From' value={fromChain} setValue={handleFrom} list={fromList} />

      <SwitchIcon onClick={switchChains}>
        <Image src={arrowRightIcon} alt='Switch' width={24} height={24} />
      </SwitchIcon>

      <ChainSelect label='To' value={toChain} setValue={handleTo} list={toList} />
    </ChainSectionContainer>
  );
};

const SwitchIcon = styled(IconButton)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderColor: currentTheme.steel[700],
    backgroundColor: currentTheme.steel[800],
    borderRadius: '1.2rem',
    padding: '1.6rem',
    height: '5.6rem',

    '&:hover': {
      backgroundColor: currentTheme.steel[700],
    },
  };
});

const ChainSectionContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'end',
    justifyContent: 'end',
    gap: '0.8rem',
    width: '100%',
    button: {
      marginTop: 'auto',
    },
  };
});
