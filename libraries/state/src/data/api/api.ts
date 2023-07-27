/* eslint-disable no-bitwise */
import type { DataState, State, UID } from '../../index.js';
import { dataSliceCreate } from '../data.slice.js';
import type {
  Api, ApiCreator,
} from './api.types.js';

export const apiKey = 'api';

export function apiCreate(
  api: ApiCreator,
): Api {
  const apiNew: Api = {
    $id: `${api?.$system}${api.reducerPath}` as UID,
    ...api,
  };

  return apiNew;
}

export const apiSlice = dataSliceCreate({
  key: apiKey,
  create: apiCreate,
  selectors: {

    /**
     * Selects all system apis
     */
    systemApis: (state: State, systemId: UID): Api[] => {
      const slice = state[apiKey] as DataState<Api>;
      const apis = Object.values(slice.entities).filter(
        (api) => api?.$system === systemId,
      ) as Api[];
      return apis;
    },

    /**
     * Selects a system api by its reducer path.
     */
    systemApi: (state: State, $system: UID, reducerPath: string): Api | undefined => {
      const slice = state[apiKey] as DataState<Api>;
      const api = slice.entities[`${$system}${reducerPath}` as UID];
      return api;
    },
  },
});
