import { createApi } from '@amnis/state/rtk/query/react';
import { dynamicBaseQuery } from '../util/index.js';
import { apiAuthQueries } from './auth.queries.js';

const reducerPath = 'apiAuth';

export const apiAuth = createApi({
  reducerPath,
  baseQuery: dynamicBaseQuery(reducerPath),
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
