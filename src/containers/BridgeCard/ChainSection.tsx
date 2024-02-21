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

  const transactionTypeForce = customTransactionType?.includes('force');
  const fromChainList = transactionTypeForce ? l1Chains : fromList;
  const toChainList = transactionTypeForce ? l2Chains : toList;

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

      <SwitchIcon onClick={switchChains} disabled={transactionTypeForce}>
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
      backgroundColor: currentTheme.steel[700],
    },

    '&:disabled': {
      fontWeight: 500,
      backgroundColor: currentTheme.steel[700],
      borderColor: currentTheme.steel[700],
      color: currentTheme.steel[500],
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
