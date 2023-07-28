/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type {
  IoOutputJson,
  EntityObjects,
} from '@amnis/state';
import type { ApiSysSchema } from '../../api.sys.types.js';

export const apiSysQueries = <T extends EndpointBuilder<BaseQueryFn, string, string>>(
  builder: T,
) => ({

  system: builder.query<
  IoOutputJson<EntityObjects>,
  { url: string; set?: boolean }
  >({
    query: ({ url }) => ({
      url: url ?? 'system',
      method: 'get',
    }),
  }),

  schema: builder.query<
  IoOutputJson<JSON>,
  ApiSysSchema
  >({
    query: (payload) => ({
      url: 'schema',
      method: 'get',
      body: payload,
    }),
  }),

});

export default apiSysQueries;
