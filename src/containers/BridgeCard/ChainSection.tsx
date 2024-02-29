import { Chain } from 'viem';
import { Box, IconButton, styled } from '@mui/material';
import Image from 'next/image';

import arrowRightIcon from '~/assets/icons/arrow-right.svg';

import { useChain, useCustomTheme, useToken, useTokenList, useTransactionData } from '~/hooks';
import { ChainSelect } from '~/components';

export const ChainSection = () => {
  const { customTransactionType } = useTransactionData();
  const { fromList, toList, setFromChain, setToChain, fromChain, toChain, switchChains, l1Chains, l2Chains } =
    useChain();

  const { setSelectedToken } = useToken();
  const { fromTokens } = useTokenList();

  const fromChainList = customTransactionType?.includes('force') ? l1Chains : fromList;
  const toChainList = customTransactionType?.includes('force') ? l2Chains : toList;

  const handleFrom = (chain: Chain) => {
    setFromChain(chain);

    // Reset token when chain is changed
    const ethtoken = fromTokens.find((token) => token.symbol === 'ETH');
    setSelectedToken(ethtoken!);
  };

  const handleTo = (chain: Chain) => {
    setToChain(chain);
  };

  return (
    <ChainSectionContainer>
      <ChainSelect label='From' value={fromChain} setValue={handleFrom} list={fromChainList} />

      <SwitchIcon onClick={switchChains} disabled={customTransactionType?.includes('force')}>
        <Image src={arrowRightIcon} alt='Switch' width={24} height={24} />
      </SwitchIcon>

      <ChainSelect label='To' value={toChain} setValue={handleTo} list={toChainList} />
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
      backgroundColor: currentTheme.steel[800],
      borderColor: currentTheme.steel[600],
    },

    '&:disabled': {
      color: currentTheme.steel[500],
      backgroundColor: currentTheme.steel[800],
      border: 'none',
      opacity: 1,
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
