import React from 'react';
import '@amnis/api';
import { set as stateSet } from '@amnis/state/set';
import { set as apiSet } from '@amnis/api/set';
import type {
  Middleware, Reducer,
} from '@reduxjs/toolkit';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useDispatchRR, useSelector as useSelectorRR, Provider as ProviderRR } from 'react-redux';
import { Mocker } from './Mocker.js';

interface Set<
  R extends Record<string, Reducer> = Record<string, Reducer>,
  M extends Middleware[] = Middleware[]
> {
  reducers: R,
  middleware: M,
}

interface CreateWebsiteOptions<S extends Set[]> {
  sets?: S,
  imports?: string[],
}

/**
 * Initializes website instances for a react web application.
 *
 * @example ```ts
 * import { createWebsite } from '@amnis/sys/react';
 *
 * export const Website = createWebsite();
 * ```
 */
export function createWebsite<S extends Set[]>({
  sets,
  imports = [],
}: CreateWebsiteOptions<S> = {}) {
  const reducers = sets?.reduce(
    (acc, set) => ({ ...acc, ...set.reducers }),
    {},
  ) || {};
  const middleware = sets?.reduce(
    (acc, set) => [...acc, ...set.middleware],
    [] as Middleware[],
  ) || [];

  const reducer = combineReducers({
    ...stateSet.reducers,
    ...apiSet.reducers,
    ...reducers,
  });

  const store = configureStore({
    reducer,
    middleware: (gDM) => gDM().concat([
      ...stateSet.middleware,
      ...apiSet.middleware,
      ...middleware,
    ]),
  });

  const useDispatch = () => useDispatchRR<typeof store.dispatch>();
  const useSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelectorRR;

  const Provider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <ProviderRR store={store}>
      <Mocker systems={[
        '@amnis/state',
        '@amnis/api',
        ...imports,
      ]}>
        {children}
      </Mocker>
    </ProviderRR>);

  return {
    store,
    useDispatch,
    useSelector,
    Provider,
  };
}

export default createWebsite;
