/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn, EndpointBuilder } from '@amnis/state/rtk/query';
import type {
  IoOutputJson,
  EntityObjects,
  Schema,
} from '@amnis/state';
import type { ApiSysLocale, ApiSysSchema } from '../../api.sys.types.js';

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
  IoOutputJson<Schema[]>,
  ApiSysSchema
  >({
    query: (payload) => ({
      url: 'schema',
      method: 'post',
      body: payload,
    }),
  }),

  locale: builder.query<
  IoOutputJson<Record<string, never>>,
  ApiSysLocale
  >({
    query: (payload) => ({
      url: 'locale',
      method: 'post',
      body: payload,
    }),
  }),

});

export default apiSysQueries;
