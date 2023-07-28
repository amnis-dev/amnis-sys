/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IoOutputJson,
  DataCreator,
  DataDeleter,
  EntityObjects,
  DataQuery,
  DataUpdater,
} from '@amnis/state';
import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export const apiCrudQueries = <T extends EndpointBuilder<BaseQueryFn, string, string>>(
  builder: T,
) => ({
  create: builder.mutation<
  IoOutputJson<EntityObjects>,
  DataCreator
  >({
    query: (payload) => ({
      url: 'create',
      method: 'post',
      body: payload,
    }),
  }),

  read: builder.query<
  IoOutputJson<EntityObjects>,
  DataQuery
  >({
    query: (payload) => ({
      url: 'read',
      method: 'post',
      body: payload,
    }),
  }),

  update: builder.mutation<
  IoOutputJson<EntityObjects>,
  DataUpdater
  >({
    query: (payload) => ({
      url: 'update',
      method: 'post',
      body: payload,
    }),
  }),

  delete: builder.mutation<
  IoOutputJson<DataDeleter>,
  DataDeleter
  >({
    query: (payload) => ({
      url: 'delete',
      method: 'post',
      body: payload,
    }),
  }),
});

export default apiCrudQueries;
