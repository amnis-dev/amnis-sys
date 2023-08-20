/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  DataDeleter,
} from '@amnis/state';
import { dataActions } from '@amnis/state';
import type { Middleware } from '@amnis/state/rtk';
import { isAnyOf } from '@amnis/state/rtk';
import { apiCrud } from './crud.api.js';

export const apiCrudMiddleware: Middleware = () => (next) => (action) => {
  /**
   * ================================================================================
   * CASE: Create, Update
   */
  if (
    isAnyOf(
      apiCrud.endpoints.create.matchFulfilled,
      apiCrud.endpoints.update.matchFulfilled,
    )(action)
  ) {
    const { payload: { result } } = action;
    if (!result) {
      return next(action);
    }

    next(dataActions.insert(result));
  }

  /**
   * ================================================================================
   * CASE: Read
   */
  if (
    apiCrud.endpoints.read.matchFulfilled(action)
  ) {
    const { payload: { result } } = action;
    if (!result) {
      return next(action);
    }

    next(dataActions.create(result));
  }

  /**
   * ================================================================================
   * CASE: Delete
   */
  if (apiCrud.endpoints.delete.matchFulfilled(action)) {
    const { payload: { result } } = action;
    if (!result) {
      return next(action);
    }

    const dataDeleter: DataDeleter = { ...result };
    next(dataActions.delete(dataDeleter));
  }

  return next(action);
};

export default apiCrudMiddleware;
