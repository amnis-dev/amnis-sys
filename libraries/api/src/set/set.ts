import type { ExtractRootState } from '@amnis/state/set';
import { apiSys } from '../query/sys/index.js';
import { apiSysMiddleware } from '../query/sys/sys.mw.js';
import { apiAuth } from '../query/auth/index.js';
import { apiAuthMiddleware } from '../query/auth/auth.mw.js';
import { apiCrud } from '../query/crud/index.js';
import { apiCrudMiddleware } from '../query/crud/crud.mw.js';
import { apiMiddleware } from '../query/mw.js';

const reducers = {
  [apiSys.reducerPath]: apiSys.reducer,
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
};

export type SetRoot = ExtractRootState<typeof reducers>;

export const set = {
  slices: {},
  reducers,
  middleware: [
    apiSys.middleware,
    apiAuth.middleware,
    apiCrud.middleware,
    apiMiddleware,
    apiSysMiddleware,
    apiAuthMiddleware,
    apiCrudMiddleware,
  ],
};

export default set;
