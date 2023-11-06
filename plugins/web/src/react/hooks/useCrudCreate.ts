import React from 'react';
import type { DataCreator, EntityObjects } from '@amnis/state';
import { apiCrud } from '@amnis/api';
import { useWebDispatch } from './useWebDispatch.js';

/**
 * Performs a read request to the CRUD API given the data query.
 */
export function useCrudCreate() {
  const dispatch = useWebDispatch();

  const [fetching, fetchingSet] = React.useState(true);
  const [loading, loadingSet] = React.useState(false);

  const trigger = React.useCallback<(
  creator: DataCreator) => Promise<EntityObjects>
  >(
    async (creator: DataCreator) => {
      loadingSet(true);

      const result = await dispatch(apiCrud.endpoints.create.initiate(creator));

      loadingSet(false);
      fetchingSet(false);

      if ('error' in result) {
        return {};
      }

      return result.data?.result ?? {};
    },
    [],
    );

  return {
    crudCreate: trigger,
    crudCreateLoading: loading,
    crudCreateFetching: fetching,
    crudCreatePending: loading || fetching,
  };
}

export default useCrudCreate;
