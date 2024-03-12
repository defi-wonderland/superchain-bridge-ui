import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { QueryParamKey } from '~/types/queryParam';

export const useQueryParams = () => {
  const router = useRouter();

  const updateQueryParams = useCallback(
    (key: QueryParamKey, value: string) => {
      router.push({ query: { ...router.query, [key]: value } });
    },
    [router],
  );

  const getParam = useCallback(
    (key: QueryParamKey) => {
      return (router.query[key] as string) || '';
    },
    [router],
  );

  return { updateQueryParams, getParam };
};
