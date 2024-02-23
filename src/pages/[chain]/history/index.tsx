import { Box, Typography, styled } from '@mui/material';
import { useAccount } from 'wagmi';
import Image from 'next/image';

import copyIcon from '~/assets/icons/copy.svg';
// import { finalizeWithdrawal, proveWithdrawal } from '~/utils';
import { MainCardContainer, ActivityTable, BackButton } from '~/containers';
import { truncateAddress } from '~/utils';
import { CustomHead } from '~/components';
import { useCustomTheme } from '~/hooks';

const History = () => {
  const { address: currentAddress } = useAccount();
  // const [searchAddress, setSearchAddress] = useState(currentAddress || '');
  // const { updateQueryParams, getParam } = useQueryParams();
  // const [address, setAddress] = useState(currentAddress || '');

  // const { customClient } = useCustomClient();

  // update local state and searchParams on input change
  // const onInputAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchAddress(e.target.value);
  //   updateQueryParams(QueryParamKey.address, e.target.value);
  // };

  // useEffect(() => {
  //   const address = getParam(QueryParamKey.address);
  //   if (isAddress(address)) {
  //     // when the address is valid, trigger the search
  //     setAddress(address); // temporary
  //   }
  // }, [getParam, searchAddress]);

  // const initateTransaction = async (status: string, receipt: TransactionReceipt) => {
  //   if (status === 'ready-to-prove') {
  //     await proveWithdrawal({ customClient, receipt, userAddress: currentAddress! });
  //   } else if (status === 'ready-to-finalize') {
  //     await finalizeWithdrawal({ customClient, receipt, userAddress: currentAddress! });
  //   }
  // };

  return (
    <Container>
      <CustomHead title='Account History' />

      <BackButton href='/' />

      <SMainCardContainer>
        <HeaderContainer>
          <Typography variant='h1'>Account History</Typography>

          <Box>
            {currentAddress && <Typography variant='body1'>{truncateAddress(currentAddress || '0x')}</Typography>}
            <Image src={copyIcon} alt='Copy to clipboard' />
          </Box>
        </HeaderContainer>

        <ActivityTable />

        {/* {depositLogs?.failedTxs.map((failedLog) => (
          <React.Fragment key={failedLog.transactionHash}>
            <Paper square={false} sx={{ mt: 2, p: 2 }}>
              <Box>
                <Box>
                  <h4>Transaction: {failedLog.transactionHash}</h4>
                  <p>Status: {failedLog.eventName}</p>
                </Box>
              </Box>
              <Button onClick={() => null}>Initiate Replay</Button>
            </Paper>
          </React.Fragment>
        ))}
        {withdrawLogs?.receipts.map((receipt, index) => (
          <React.Fragment key={receipt.transactionHash}>
            <Paper square={false} sx={{ mt: 2, p: 2 }}>
              <Box>
                <Box>
                  <h4>Transaction: {receipt.transactionHash}</h4>
                  <p>Status: {withdrawLogs.status[index]}</p>
                </Box>
              </Box>
              <Button onClick={() => initateTransaction(withdrawLogs.status[index], receipt)}>
                Initiate transaction
              </Button>
            </Paper>
          </React.Fragment>
        ))} */}
      </SMainCardContainer>
    </Container>
  );
};

export default History;

export const SMainCardContainer = styled(MainCardContainer)(() => {
  // const { currentTheme } = useCustomTheme();
  return {
    overflow: 'auto',
    width: '84.3rem',
    maxHeight: '68rem',
    boxShadow: 'none',
    padding: '2rem 3.2rem',
  };
});

const Container = styled(Box)(() => {
  return {
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  };
});

const HeaderContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();

  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    gap: '1.2rem',
    h1: {
      color: currentTheme.steel[50],
      fontSize: '3rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    div: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0.8rem',
      cursor: 'pointer',
    },
    p: {
      color: currentTheme.steel[300],
      fontSize: '1.6rem',
      fontWeight: 400,
      lineHeight: '1.8rem',
    },
  };
});
