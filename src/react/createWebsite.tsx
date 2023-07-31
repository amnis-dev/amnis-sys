import React from 'react';
import '@amnis/api';
import type {
  Middleware, Reducer,
} from '@reduxjs/toolkit';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useDispatchRR, useSelector as useSelectorRR, Provider as ProviderRR } from 'react-redux';
import { set as webSet } from '@amnis/web/set';
import { set as stateSet } from '@amnis/state/set';
import { set as apiSet } from '@amnis/api/set';
import { Mocker } from './Mocker.js';
import { systemImporter } from '../systemImporter.js';
import type { AmnisSet } from '../types.js';
import { AmnisSysModule } from '../types.js';
import { createWebsiteContext } from './createWebsiteContext.js';

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
  imports = [],
}: CreateWebsiteOptions<S> = {}) {
  const intialReducers = {
    ...stateSet.reducers,
    ...apiSet.reducers,
    ...webSet.reducers,
  };

  const store = configureStore({
    reducer: combineReducers(intialReducers),
    middleware: (gDM) => gDM().concat([
      ...stateSet.middleware,
      ...apiSet.middleware,
      ...webSet.middleware,
    ]),
  });

  /**
   * Dynamically extends the store with reducers from amnis sets.
   */
  async function asyncStore(sets: AmnisSet[]) {
    const reducers = sets.reduce<AmnisSet['reducers']>(
      (acc, set) => ({ ...acc, ...set.reducers }),
      {},
    );
    store.replaceReducer(combineReducers({ ...intialReducers, ...reducers }));
  }

  /**
   * Website context.
   */
  const Context = createWebsiteContext();

  /**
   * Dispatcher with core Amnis types.
   */
  const useDispatch = () => useDispatchRR<typeof store.dispatch>();

  /**
   * Selector with core Amnis types.
   */
  const useSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelectorRR;

  /**
   * Imports an Amnis System package needed for components.
   */
  const useImport = (path: string) => {
    const { importing, packagesDispatch } = React.useContext(Context);
    React.useEffect(() => {
      packagesDispatch(path);
    }, [path]);
    return importing;
  };

  /**
   * The website provider for a react web application.
   * In development mode, this component will mock the APIs with an in-memory database.
   *
   * @example ```tsx
   * import { createWebsite } from '@amnis/sys/react';
   *
   * export const Website = createWebsite();
   *
   * export const App = () => (
   *  <Website.Provider>
   *   <div>My App</div>
   *  </Website.Provider>
   * );
   * ```
   */
  const Provider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [importing, importingSet] = React.useState(true);

    const [packages, packagesDispatch] = React.useReducer(
      (state: string[], action: string) => {
        if (state.includes(action)) return state;
        return [...state, action];
      },
      Array.from(new Set([
        '@amnis/state',
        '@amnis/api',
        '@amnis/web',
        ...imports,
      ])),
    );

    React.useLayoutEffect(() => {
      importingSet(true);
      (async () => {
        const { sets } = await systemImporter(packages.slice(2), { modules: AmnisSysModule.Set });
        await asyncStore(sets);
        importingSet(false);
      })();
    }, [packages]);

    /**
     * Create a memorized value for the context.
     */
    const contextValue = React.useMemo(() => ({
      importing,
      packages,
      packagesDispatch,
    }), [importing, packages, packagesDispatch]);

    return (
      <ProviderRR store={store}>
        <Context.Provider value={contextValue}>
          <Mocker systems={packages}>
            {children}
          </Mocker>
        </Context.Provider>
      </ProviderRR>
    );
  };

  return {
    store,
    useDispatch,
    useSelector,
    Provider,
    Context,
    useImport,
  };
}

export default createWebsite;
