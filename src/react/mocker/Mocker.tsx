import React from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useWebDispatch, useWebSelector } from '@amnis/web';
import {
  databaseMemoryClear,
  dataActions,
  systemSlice,
} from '@amnis/state';
import type {
  DynamicPlugin,
} from '@amnis/state';
import { importerPlugins } from '../../importer.js';
import { pluginMerge } from '../../plugin.js';
import { MockerContext, type MockerAccount, type MockerContextProps } from './MockerContext.js';
import { MockerAgent } from './MockerAgent.js';
/**
 * Check if node is in development mode.
 */
export const isDev = process.env.NODE_ENV === 'development';

export interface MockerProps {
  /**
   * An array of import paths to amnis systems.
   *
   * @example ```tsx
   * import { Mocker } from '@amnis/mock/react';
   * import pluginState from '@amnis/state/plugin';
   * import pluginApi from '@amnis/api/plugin';
   *
   * export const App = () => (
   *  <Mocker
   *   plugins={[pluginState, pluginApi]}
   *  >
   *   <div>My App</div>
   *  </Mocker>
   * );
   * ```
   */
  plugins: DynamicPlugin[];

  children: React.ReactNode;
}

/**
   * Mocks the apis and state for a react web application.
   *
   * @example ```tsx
   * import { Mocker } from '@amnis/mock/react';
   *
   * export const App = () => (
   *  <Mocker
   *   systems={[
   *    '@amnis/state',
   *    '@amnis/api',
   *   ])
   *  >
   *   <div>My App</div>
   *  </Mocker>
   * );
   * ```
   */
export const Mocker: React.FC<MockerProps> = ({
  plugins: pluginsDynamic,
  children,
}) => {
  /**
   * If the node environment is not in development mode, then
   * return the children as-is.
   */
  if (!isDev) return <>{children}</>;

  const dispatch = useWebDispatch();
  const system = useWebSelector(systemSlice.select.active);
  const [loading, loadingSet] = React.useState(true);
  const [account, accountSet] = React.useState<MockerAccount>(undefined);

  /**
   * Starts/Restarts the mocker service.
   */
  const startMock = React.useCallback(async (wipe = false) => {
    loadingSet(true);

    if (wipe) {
      /**
       * Clear the memory database.
       */
      databaseMemoryClear();
      dispatch(dataActions.wipe());
    }

    /**
     * Import contextSetup and mockService.
     */
    const { contextSetup } = await import('@amnis/state/context');
    const { mockService } = await import('@amnis/mock');

    mockService.stop();

    /**
     * Import the all Amnis Plugins.
     */
    const plugins = await importerPlugins(pluginsDynamic);

    /**
     * Merge all plugins.
     */
    const {
      set, schema, process, dataTest,
    } = pluginMerge(plugins);

    /**
     * Create the store for the mock service.
     */
    const store = configureStore({
      reducer: combineReducers(set?.reducers ?? {}),
      middleware: (gDM) => gDM().concat(set?.middleware ? [...set.middleware] : []),
    });

    /**
     * Setup the context for the APIs.
     */
    const context = await contextSetup({
      store,
      schemas: schema,
      data: dataTest,
    });

    /**
     * Setup the mock service.
     */
    await mockService.setup({
      hostname: window.location.origin,
      baseUrl: '/api',
      context,
      processes: process,
    });

    /**
     * Start the mock service.
     */
    mockService.start({
      onUnhandledRequest: 'bypass',
    });

    /**
     * Wait one second for the mock service to start.
     */
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    /**
     * Set loading to false.
     */
    loadingSet(false);
  }, []);

  /**
   * When this component mounts, start the mocking service.
   */
  React.useLayoutEffect(() => {
    startMock(true);
  }, []);

  const contextValue = React.useMemo<MockerContextProps>(() => ({
    account,
    accountSet,
  }), [
    account,
    accountSet,
  ]);

  return (
    <MockerContext.Provider value={contextValue}>
      {loading ? (
        <div>DEVELOPMENT MODE: Mock service is starting...</div>
      ) : (<>
        {system?.$id ? <MockerAgent /> : null}
        <React.Suspense fallback="DEVELOPMENT MODE: Loading components...">
          {children}
        </React.Suspense>
      </>)}
    </MockerContext.Provider>
  );
};
