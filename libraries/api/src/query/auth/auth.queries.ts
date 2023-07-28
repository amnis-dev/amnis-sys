/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  EndpointBuilder,
  BaseQueryFn,
} from '@reduxjs/toolkit/query';
import type {
  IoOutputJson,
  Otp,
  DataDeleter,
  EntityObjects,
} from '@amnis/state';
import type {
  ApiAuthAuthenticate,
  ApiAuthCreate,
  ApiAuthCredential,
  ApiAuthLogin,
  ApiAuthLogout,
  ApiAuthOtp,
  ApiAuthPkce,
  ApiAuthRegister,
  ApiAuthVerify,
} from '../../api.auth.types.js';

export const apiAuthQueries = <T extends EndpointBuilder<BaseQueryFn, string, string>>(
  builder: T,
) => ({

  authenticate: builder.mutation<
  IoOutputJson<EntityObjects>,
  ApiAuthAuthenticate
  >({
    query: (payload) => ({
      url: 'authenticate',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  login: builder.mutation<
  IoOutputJson<EntityObjects>,
  Omit<ApiAuthLogin, 'credential'>
  >({
    query: (payload) => ({
      url: 'login',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
    transformErrorResponse(response) {
      return response as any;
    },
  }),

  logout: builder.mutation<
  IoOutputJson<DataDeleter>,
  ApiAuthLogout
  >({
    query: (payload) => ({
      url: 'logout',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  create: builder.mutation<
  IoOutputJson<EntityObjects>,
  ApiAuthCreate
  >({
    query: (payload) => ({
      url: 'create',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  pkce: builder.mutation<
  IoOutputJson<EntityObjects>,
  ApiAuthPkce
  >({
    query: (payload) => ({
      url: 'pkce',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  register: builder.mutation<
  IoOutputJson<EntityObjects>,
  Omit<ApiAuthRegister, 'credential'>
  >({
    query: (payload) => ({
      url: 'register',
      method: 'post',
      body: payload,
    }),
  }),

  credential: builder.mutation<
  IoOutputJson<EntityObjects>,
  Omit<ApiAuthCredential, 'credential'>
  >({
    query: (payload) => ({
      url: 'credential',
      method: 'post',
      body: payload,
    }),
  }),

  otp: builder.mutation<
  IoOutputJson<Otp>,
  Omit<ApiAuthOtp, 'otp'>
  >({
    query: (payload) => ({
      url: 'otp',
      method: 'post',
      body: payload,
    }),
  }),

  verify: builder.mutation<
  IoOutputJson<boolean>,
  ApiAuthVerify
  >({
    query: (payload) => ({
      url: 'verify',
      method: 'post',
      body: payload,
    }),
  }),

});

export default apiAuthQueries;
