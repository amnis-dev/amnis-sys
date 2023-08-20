import { stateSelect, type DataQuery, type GetSelectQueryResult } from '@amnis/state';
import type { RootStateWeb } from '../../types.js';
import { useWebSelector } from './useWebSelector.js';

export type SelectQueryResultWeb = GetSelectQueryResult<RootStateWeb>;

export function useWebSelectorQuery(query: DataQuery): SelectQueryResultWeb {
  const result = useWebSelector((state) => stateSelect.query(state, query));

  return result as SelectQueryResultWeb;
}

export default useWebSelectorQuery;
