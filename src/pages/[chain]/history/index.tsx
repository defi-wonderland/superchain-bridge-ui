import { useEffect, useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { TransactionReceipt, isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useCustomClient, useLogs, useQueryParams } from '~/hooks';
import { finalizeWithdrawal, proveWithdrawal } from '~/utils';
import { QueryParamKey } from '~/types';

const History = () => {
  const { address: currentAddress } = useAccount();
  const [searchAddress, setSearchAddress] = useState(currentAddress || '');
  const { updateQueryParams, getParam } = useQueryParams();
  const [address, setAddress] = useState(currentAddress || '');
  const { withdrawLogs } = useLogs();
  const { customClient } = useCustomClient();

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

  const initateTransaction = async (status: string, receipt: TransactionReceipt) => {
    if (status === 'ready-to-prove') {
      await proveWithdrawal({ customClient, receipt, userAddress: currentAddress! });
    } else if (status === 'ready-to-finalize') {
      await finalizeWithdrawal({ customClient, receipt, userAddress: currentAddress! });
    }
  };

  return (
    <Box>
      <h1>History Page</h1>
      <br />
      <span>search Address</span> <input value={searchAddress} onChange={onInputAddressChange} />
      <br />
      <h3>Searching for address: {currentAddress ?? address}</h3>
      {withdrawLogs?.receipts.map((receipt, index) => (
        <>
          {/* Temporary inline styles */}
          <Paper square={false} sx={{ mt: 2, p: 2 }} key={receipt.transactionHash}>
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
        </>
      ))}
    </Box>
  );
};

export default History;
