import { useMemo, useState } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import Image from 'next/image';

import { useCustomTheme, useModal, useToken, useTokenList, useTransactionData } from '~/hooks';
import { CustomScrollbar, SearchInput } from '~/components';
import BaseModal from '~/components/BaseModal';
import { ModalType, TokenData } from '~/types';

export const TokensModal = () => {
  const { closeModal } = useModal();
  const { fromTokens, toTokens } = useTokenList();
  const { customTransactionType, resetValues: resetTransactionData } = useTransactionData();
  const { setSelectedToken, resetValues: resetTokenValues } = useToken();

  const [searchValue, setSearchValue] = useState('');

  // filter with the searchValue
  const tokenList = useMemo(() => {
    const search = searchValue.toLowerCase();

    const filterToken = (token: TokenData) =>
      token.symbol.toLowerCase().includes(search) ||
      token.address.toLowerCase().includes(search) ||
      token.name.toLowerCase().includes(search);

    return customTransactionType
      ? toTokens.filter((token) => filterToken(token))
      : fromTokens.filter((token) => filterToken(token));
  }, [fromTokens, customTransactionType, searchValue, toTokens]);

  const handleToken = async (token: TokenData) => {
    resetTokenValues();
    resetTransactionData();
    setSelectedToken(token);
    closeModal();
  };

  return (
    <BaseModal type={ModalType.SELECT_TOKEN} title='Select a token' fixedHeight>
      {/* Search bar */}
      <SearchInput value={searchValue} setValue={setSearchValue} placeholder='Search name or paste address' />

      <ListContainer>
        <CustomScrollbar>
          {tokenList.map((token) => (
            <Token key={token.address} onClick={() => handleToken(token)} fullWidth>
              {/* Token info section */}
              <LeftSection>
                <Image src={token.logoURI} alt={token.name} width={36} height={36} />
                <Box>
                  <Typography variant='h3'>{token.symbol}</Typography>
                  <Typography variant='body1'>{token.name}</Typography>
                </Box>
              </LeftSection>

              {/* Token balances */}
              <RightSection>
                <Box>
                  <Typography variant='h3'>2.6</Typography>
                  <Typography variant='body1'>$4.813,43</Typography>
                </Box>
              </RightSection>
            </Token>
          ))}
          {tokenList.length === 0 && (
            <NoResultsContainer>
              <Typography variant='h3'>No results found.</Typography>
            </NoResultsContainer>
          )}
        </CustomScrollbar>
      </ListContainer>
    </BaseModal>
  );
};

export const ListContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '40rem',
    // marginLeft: '-1.2rem',
    // width: 'calc(100% + 2.4rem)',
    width: '100%',
  };
});

const Token = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'space-between',
    padding: '1.2rem',
    cursor: 'pointer',
    borderRadius: '1.2rem',
    textAlign: 'start',
    textTransform: 'none',

    '&:hover': {
      backgroundColor: currentTheme.steel[700],
    },

    h3: {
      color: currentTheme.steel[100],
    },

    p: {
      color: currentTheme.steel[500],
    },

    img: {
      width: '3.6rem',
      height: '3.6rem',
      borderRadius: '50%',
    },
  };
});

const LeftSection = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.2rem',
    div: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    },
  };
});

const RightSection = styled(LeftSection)(() => {
  return {
    textAlign: 'end',
  };
});

const NoResultsContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.2rem',
    marginTop: '1.2rem',
  };
});
