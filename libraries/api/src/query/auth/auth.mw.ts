import type {
  DataCreator,
  DataDeleter,
  Entity,
  DataMetaSetter,
  UID,
} from '@amnis/state';
import {
  systemSlice,
  otpSlice,
  userSlice,
  profileSlice,
  contactSlice,
  sessionSlice,
  dataActions,
} from '@amnis/state';
import type { Middleware } from '@amnis/state/rtk';
import { isAnyOf } from '@amnis/state/rtk';
import { apiAuth } from './auth.api.js';

export const apiAuthMiddleware: Middleware = (store) => (next) => (action) => {
  /**
   * ================================================================================
   * CASES: Login, Register, Create, Credential
   */
  if (isAnyOf(
    apiAuth.endpoints.authenticate.matchFulfilled,
    apiAuth.endpoints.login.matchFulfilled,
    apiAuth.endpoints.register.matchFulfilled,
    apiAuth.endpoints.create.matchFulfilled,
    apiAuth.endpoints.credential.matchFulfilled,
  )(action)) {
    const { payload: { result } } = action;
    if (!result) {
      return next(action);
    }

    const dataCreator: DataCreator = { ...result };

    /**
     * Provide some indicator that this action was initiated by the apiAuth
     */
    next(dataActions.create(dataCreator));

    /**
     * If the action was a login request, then we need to set entity meta information.
     */

    if (result) {
      const metaSetter = Object.keys(result).reduce<DataMetaSetter>((acc, key) => {
        const entity = result[key]?.[0] as Entity | undefined;
        if (entity) {
          acc[key] = { active: result[key]?.[0].$id };
        }
        return acc;
      }, {});
      next(dataActions.meta(metaSetter));
    }
  }

  /**
   * ================================================================================
   * CASE: Logout
   */
  if (apiAuth.endpoints.logout.matchFulfilled(action)) {
    const { payload: { result } } = action;
    if (!result) {
      return next(action);
    }

    const system = systemSlice.select.active(store.getState());

    const dataDeleter: DataDeleter = {
      ...result,
      bearer: [system ? system.handle as UID : 'core' as UID],
    };
    next(dataActions.delete(dataDeleter));

    /**
     * Need to unset some active entities manually after logout.
     */
    const metaSetter: DataMetaSetter = {
      [userSlice.key]: { active: null },
      [profileSlice.key]: { active: null },
      [contactSlice.key]: { active: null },
      [sessionSlice.key]: { active: null },
    };
    next(dataActions.meta(metaSetter));
  }

  if (apiAuth.endpoints.logout.matchRejected(action)) {
    const system = systemSlice.select.active(store.getState());

    const dataDeleter: DataDeleter = {
      bearer: [system ? system.handle as UID : 'core' as UID],
    };
    next(dataActions.delete(dataDeleter));

    /**
     * Need to unset some active entities manually after logout.
     */
    const metaSetter: DataMetaSetter = {
      [userSlice.key]: { active: null },
      [profileSlice.key]: { active: null },
      [contactSlice.key]: { active: null },
      [sessionSlice.key]: { active: null },
    };
    next(dataActions.meta(metaSetter));
  }

  /**
   * ================================================================================
   * CASE: One-time password OTP
   */
  if (apiAuth.endpoints.otp.matchFulfilled(action)) {
    const { payload: { result } } = action;
    if (!result) {
      return next(action);
    }
    next(otpSlice.action.insert(result));
  }

  return next(action);
};

export default apiAuthMiddleware;
