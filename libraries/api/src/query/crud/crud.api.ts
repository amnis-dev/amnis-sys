import { createApi } from '@amnis/state/rtk/query';
import { dynamicBaseQuery } from '../util/index.js';
import { apiCrudQueries } from './crud.queries.js';

const reducerPath = 'apiCrud';

export const apiCrud = createApi({
  reducerPath,
  baseQuery: dynamicBaseQuery(reducerPath),
  endpoints: (builder) => apiCrudQueries(builder),
});

export default apiCrud;
