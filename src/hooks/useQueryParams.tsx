import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QueryParamKey } from '~/types/queryParam';

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQueryParams = useCallback(
    (key: QueryParamKey, value: string) => {
      searchParams.set(key, value);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  const getParam = useCallback(
    (key: QueryParamKey) => {
      return searchParams.get(key) || '';
    },
    [searchParams],
  );

  return { updateQueryParams, getParam };
};
