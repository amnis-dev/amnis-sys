/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { Headers, Request } from 'cross-fetch';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { Api, State } from '@amnis/state';
import {
  apiCreate, apiSlice, systemSlice,
  agentCredential, agentGet,
} from '@amnis/state';
import {
  headersAuthorizationToken,
  headersChallenge,
  headersOtp,
  headersSignature,
} from './util.headers.js';
import type { ApiError } from '../query.types.js';

if (typeof global !== 'undefined') {
  global.Headers = Headers;
  global.Request = Request;
}
if (typeof window !== 'undefined') {
  window.Headers = Headers;
  window.Request = Request;
}

export type DynamicBaseQuerySetup = (
  reducerPath: string,
  bearerId?: string
) => BaseQueryFn<string | FetchArgs, unknown, ApiError>;

/**
 * Gets the baseURL based on configuration.
 *
 * store is the complete redux store.
 */
export const dynamicBaseQuery: DynamicBaseQuerySetup = (
  reducerPath,
) => async (args, store, extraOptions) => {
  const system = systemSlice.select.active(store.getState() as State);

  let apiMeta: Api;
  let apiAuth: Api | undefined;
  let baseUrl = '/';
  if (!system) {
    apiMeta = apiCreate({
      reducerPath,
    });
  } else {
    const api = apiSlice.select.systemApi(store.getState() as State, system.$id, reducerPath);
    if (!api) {
      apiMeta = apiCreate({
        reducerPath,
      });
    } else {
      apiMeta = api;
      baseUrl = apiMeta.baseUrl ?? '/';
    }
    const apis = apiSlice.select.systemApis(store.getState() as State, system.$id);
    apiAuth = apis.find((a) => a.auth === true);
  }

  /**
   * Exception for apiAuth...
   * Set the credential to further simplify auth requests.
   */
  if (
    reducerPath === 'apiAuth'
    && typeof args !== 'string'
  ) {
    if (['reset'].includes(args.url)) {
      const agent = await agentGet();
      args.body.$credential = agent.credentialId;
    }
    if (['login', 'register', 'credential'].includes(args.url)) {
      const credential = await agentCredential();
      args.body.credential = credential;
    }
  }

  /**
   * Dynamically prepare the request query.
   */
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    fetchFn: fetch,
    prepareHeaders: async (headers, api) => {
      /**
       * Set the content type to JSON.
       */
      headers.set('Content-Type', 'application/json');

      /**
       * Apply a bearer if needed.
       */
      if (
        system
        && apiAuth
        && apiMeta?.bearer
        && (apiMeta.bearer === true || apiMeta.bearer.includes(api.endpoint))
      ) {
        const bearerId = apiMeta.bearerId ?? system.handle;
        await headersAuthorizationToken(
          headers,
          store,
          api.getState() as State,
          bearerId,
          system,
          apiAuth,
        );
      }

      /**
       * Provide a signature headers on the required requests
       */
      if (
        apiMeta?.signature
        && (apiMeta.signature === true || apiMeta.signature.includes(api.endpoint))
      ) {
        if (typeof args === 'string') {
          await headersSignature(headers, args);
        } else {
          await headersSignature(headers, args.body);
        }
      }

      /**
       * Provide challenge headers on the required requests
       */
      if (
        system
        && apiAuth
        && apiMeta?.challenge
        && (apiMeta.challenge === true || apiMeta.challenge.includes(api.endpoint))
      ) {
        await headersChallenge(headers, system, apiAuth);
      }

      /**
       * Provide one-time password (OTP) headers on the required requests
       */
      if (
        apiMeta?.otp
        && (apiMeta.otp === true || apiMeta.otp.includes(api.endpoint))
      ) {
        headersOtp(headers, api.getState() as State);
      }

      return headers;
    },
  }) as BaseQueryFn<string | FetchArgs, unknown, ApiError>;
  return rawBaseQuery(args, store, extraOptions);
};

export default dynamicBaseQuery;
