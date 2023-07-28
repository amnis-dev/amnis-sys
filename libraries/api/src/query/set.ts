import { apiSys } from './sys/index.js';
import { apiSysMiddleware } from './sys/sys.mw.js';
import { apiAuth } from './auth/index.js';
import { apiAuthMiddleware } from './auth/auth.mw.js';
import { apiCrud } from './crud/index.js';
import { apiCrudMiddleware } from './crud/crud.mw.js';
import { apiMiddleware } from './mw.js';

const reducerApi = {
  [apiSys.reducerPath]: apiSys.reducer,
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
};

export const apiSet = {
  reducers: reducerApi,
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

export default apiSet;
