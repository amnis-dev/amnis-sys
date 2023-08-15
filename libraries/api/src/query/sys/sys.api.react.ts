import '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../util/index.js';
import { apiSysQueries } from './sys.queries.js';

const reducerPath = 'apiSys';

export const apiSys = createApi({
  reducerPath,
  baseQuery: dynamicBaseQuery(reducerPath),
  endpoints: (builder) => apiSysQueries(builder),
});

export default apiSys;
