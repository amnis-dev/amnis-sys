import React from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { type DynamicPlugin, databaseMemoryClear } from '@amnis/state';
import { importerPlugins } from '../importer.js';
import { pluginMerge } from '../plugin.js';

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
   *   plugins={[pluginState, pluginApi.id]}
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

  const [loading, loadingSet] = React.useState(true);

  /**
   * If the node environment is in development mode, then
   * mock the apis and return the children.
   */
  React.useLayoutEffect(() => {
    (async () => {
      /**
       * Clear the memory database.
       */
      databaseMemoryClear();

      /**
       * Import contextSetup and mockService.
       */
      const { contextSetup } = await import('@amnis/state/context');
      const { mockService } = await import('@amnis/mock');

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
    })();
  }, []);

  return loading ? (
    <div>DEVELOPMENT MODE: Mock service is starting...</div>
  ) : (
    <React.Suspense fallback="DEVELOPMENT MODE: Loading components...">
      {children}
    </React.Suspense>
  );
};
