import { useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useQueryParams } from '~/hooks';
import { QueryParamKey } from '~/types';

const History = () => {
  const { address: currentAddress } = useAccount();
  const [searchAddress, setSearchAddress] = useState(currentAddress || '');
  const { updateQueryParams, getParam } = useQueryParams();
  const [address, setAddress] = useState(currentAddress || '');

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

  return (
    <>
      <h1>History Page</h1>
      <br />
      <span>search Address</span> <input value={searchAddress} onChange={onInputAddressChange} />
      <br />
      <h3>Searching for address: {address}</h3>
    </>
  );
};

export default History;
