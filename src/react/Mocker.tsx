import React from 'react';
import { systemImporter } from '../systemImporter.js';

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
  systems: string[];
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
  systems,
  children,
}) => {
  /**
   * If the node environment is not in development mode, then
   * return the children as-is.
   */
  if (!isDev) return <>{children}</>;

  const loading = React.useState(true);

  /**
   * If the node environment is in development mode, then
   * mock the apis and return the children.
   */
  React.useEffect(() => {
    (async () => {
      /**
       * Import contextSetup and mockService.
       */
      const { contextSetup } = await import('@amnis/state/context');
      const { mockService } = await import('@amnis/mock');

      /**
       * Import the Amnis Systems.
       */
      const { schemas, processes } = await systemImporter(systems);

      /**
       * Setup the context for the APIs.
       */
      const context = await contextSetup({
        schemas,
      });

      /**
       * Setup the mock service.
       */
      await mockService.setup({
        hostname: window.location.hostname,
        baseUrl: '/api',
        context,
        processes,
      });

      /**
       * Start the mock service.
       */
      await mockService.start({
        onUnhandledRequest: 'bypass',
      });

      /**
       * Set loading to false.
       */
      loading[1](false);
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
