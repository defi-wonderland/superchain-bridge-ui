import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

// import { finalizeWithdrawal, proveWithdrawal } from '~/utils';
import { MainCardContainer } from '~/containers';
import { useQueryParams } from '~/hooks';
import { QueryParamKey } from '~/types';

const History = () => {
  const { address: currentAddress } = useAccount();
  const [searchAddress, setSearchAddress] = useState(currentAddress || '');
  const { updateQueryParams, getParam } = useQueryParams();
  const [address, setAddress] = useState(currentAddress || '');
  // const { withdrawLogs, depositLogs } = useLogs();
  // const { customClient } = useCustomClient();

  // update local state and searchParams on input change
  const onInputAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
    updateQueryParams(QueryParamKey.address, e.target.value);
  };

  useEffect(() => {
    const address = getParam(QueryParamKey.address);
    if (isAddress(address)) {
      // when the address is valid, trigger the search
      setAddress(address); // temporary
    }
  }, [getParam, searchAddress]);

  // const initateTransaction = async (status: string, receipt: TransactionReceipt) => {
  //   if (status === 'ready-to-prove') {
  //     await proveWithdrawal({ customClient, receipt, userAddress: currentAddress! });
  //   } else if (status === 'ready-to-finalize') {
  //     await finalizeWithdrawal({ customClient, receipt, userAddress: currentAddress! });
  //   }
  // };

  return (
    <Container>
      <SMainCardContainer>
        <h1>History Page</h1>
        <br />
        <span>search Address</span> <input value={searchAddress} onChange={onInputAddressChange} />
        <br />
        <h3>Searching for address: {currentAddress ?? address}</h3>
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
  };
});

const Container = styled(Box)(() => {
  return {
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };
});
