/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Api,
  DataCreator,
  IoOutput,
  Log,
} from '@amnis/state';
import {
  apiCreate,

  logSlice,
  apiKey,
  bearerKey,
  dataActions,
  localeSlice,
} from '@amnis/state';
import type { Middleware } from '@reduxjs/toolkit';
import { isRejected, isFulfilled } from '@reduxjs/toolkit';

export const apiMiddleware: Middleware = () => (next) => (action) => {
  /**
   * IoOutput should be returned from all api requests.
   */
  if (isFulfilled(action)) {
    const { payload, meta } = action;

    if (!payload || typeof payload !== 'object') {
      return next(action);
    }

    /**
     * Assume that the payload is possible IoOutput's json property.
     * Still need to check for the existence of the logs and bearers properties.
     */
    const {
      logs, bearers, apis, locale,
    } = payload as Partial<IoOutput['json']>;
    const dataCreator: DataCreator = {};

    if (logs) {
      dataCreator[logSlice.key] = logs.map((log) => logSlice.createEntity(log));
    }

    if (locale) {
      dataCreator[localeSlice.key] = locale.map((l) => localeSlice.createEntity(l));
    }

    if (bearers) {
      dataCreator[bearerKey] = bearers;
    }

    if (apis) {
      const { originalArgs } = meta.arg as Record<string, any>;
      /**
       * Remap the API base URLs to be absolute if they aren't.
       */
      let origin: string;

      try {
        origin = new URL(originalArgs?.url).origin;
      } catch (e) {
      /**
       * If the URL is invalid, we'll just use the default origin.
       */
        if (typeof window !== 'undefined') {
          origin = window.location.origin;
        } else {
          origin = 'http://localhost';
        }
      }

      const apisRemapped = apis.map<Api>((api) => {
        const baseUrl = api.baseUrl ?? '';
        const apiUrlAbsolute = /^(?:[a-z+]+:)?\/\//.test(baseUrl);

        if (apiUrlAbsolute) {
          return api;
        }

        const newBaseUrl = new URL(baseUrl, origin).href;

        return {
          ...api,
          baseUrl: newBaseUrl,
        };
      });

      dataCreator[apiKey] = apisRemapped.map((api) => apiCreate(api));
    }

    if (Object.keys(dataCreator).length > 0) {
      next(dataActions.create(dataCreator));
    }
  }

  /**
   * On a rejected action, just capture the logs and add them to the store.
   */
  if (isRejected(action)) {
    const { payload } = action;

    const logs = (payload as any)?.data?.logs as Log[] | undefined;

    if (logs) {
      const logEntities = logs.map((log) => logSlice.createEntity(log));
      next(dataActions.create({
        [logSlice.key]: logEntities,
      }));
    }
  }

  return next(action);
};

export default apiMiddleware;
