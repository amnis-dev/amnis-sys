import React from 'react';
import type { EntityObjects } from '@amnis/state';
import type { ApiAuthLogin } from '@amnis/api';
import { apiAuth } from '@amnis/api';
import { useWebDispatch } from './useWebDispatch.js';

/**
 * Performs a read request to the CRUD API given the data query.
 */
export function useAuthLogin() {
  const dispatch = useWebDispatch();

  const [fetching, fetchingSet] = React.useState(true);
  const [loading, loadingSet] = React.useState(false);
  const [errored, erroredSet] = React.useState(false);

  const trigger = React.useCallback<(
  request: Omit<ApiAuthLogin, 'credential'>) => Promise<EntityObjects>
  >(
    async (request: Omit<ApiAuthLogin, 'credential'>) => {
      loadingSet(true);
      erroredSet(false);

      const result = await dispatch(apiAuth.endpoints.login.initiate(request));

      if ('error' in result) {
        loadingSet(false);
        fetchingSet(false);
        erroredSet(true);
        return {};
      }

      loadingSet(false);
      fetchingSet(false);
      return result.data?.result ?? {};
    },
    [],
    );

  return {
    authLogin: trigger,
    authLoginLoading: loading,
    authLoginFetching: fetching,
    authLoginPending: loading || fetching,
    authLoginErrored: errored,
  };
}

export default useAuthLogin;
