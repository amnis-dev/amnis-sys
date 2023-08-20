import '@amnis/state/rtk';
import { createApi } from '@amnis/state/rtk/query/react';
import { dynamicBaseQuery } from '../util/index.js';
import { apiSysQueries } from './sys.queries.js';

const reducerPath = 'apiSys';

export const apiSys = createApi({
  reducerPath,
  baseQuery: dynamicBaseQuery(reducerPath),
  endpoints: (builder) => apiSysQueries(builder),
});

export default apiSys;
