import React from 'react';
import type { DataQuery, EntityObjects } from '@amnis/state';
import { apiCrud } from '@amnis/api';
import { useWebDispatch } from './useWebDispatch.js';

/**
 * Performs a read request to the CRUD API given the data query.
 */
export function useCrudRead({
  forceRefetch = false,
} = {}) {
  const dispatch = useWebDispatch();

  const [fetching, fetchingSet] = React.useState(true);
  const [loading, loadingSet] = React.useState(false);

  const trigger = React.useCallback<(
  query: DataQuery) => Promise<EntityObjects>
  >(
    async (query: DataQuery) => {
      loadingSet(true);

      const result = await dispatch(apiCrud.endpoints.read.initiate(query, {
        forceRefetch,
      }));

      loadingSet(false);
      fetchingSet(false);
      return result.data?.result ?? {};
    },
    [],
    );

  return {
    crudRead: trigger,
    crudReadLoading: loading,
    crudReadFetching: fetching,
    crudReadPending: loading || fetching,
  };
}

export default useCrudRead;
