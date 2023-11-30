import React from 'react';
import '@amnis/api';
import { Provider as ProviderRR } from 'react-redux';
import { configureStore, combineReducers } from '@amnis/state/rtk';
import { set as webSet } from '@amnis/web';
import { set as stateSet } from '@amnis/state/set';
import { set as apiSet } from '@amnis/api/set';
import pluginState from '@amnis/state/plugin';
import pluginApi from '@amnis/api/plugin';
import pluginWeb from '@amnis/web/plugin';
import type {
  StaticPlugin, ReduxSet,
} from '@amnis/state';

import { Mocker } from './mocker/Mocker.js';
import { WebsiteContext } from './WebsiteContext.js';
import { importerPlugin } from '../importer.js';
import { pluginSetsMerge } from '../plugin.js';
import { WebsiteApp } from './WebsiteApp.js';
import type { WebsiteCreateOptions } from './websiteCreate.types.js';

/**
 * Initializes the system for web-based react applications.
 *
 * @example ```ts
 * import { websiteCreate } from '@amnis/sys/react';
 *
 * export const Website = websiteCreate();
 * ```
 */
export function websiteCreate({
  system,
  hostname,
  plugins = [],
  mocker: mockerOptions,
}: WebsiteCreateOptions = {}) {
  const ids = new Set<string>(['@amnis/state', '@amnis/api', '@amnis/web']);
  const pluginsDynamic = [
    pluginState,
    pluginApi,
    pluginWeb,
    ...plugins.filter((plugin) => {
      if (ids.has(plugin.key)) return false;
      ids.add(plugin.key);
      return true;
    }),
  ];

  /**
   * Stores plugins that have been dynamically imported.
   */
  const pluginsBuffer: (StaticPlugin | undefined)[] = new Array(pluginsDynamic.length);

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
   * Dynamically extends the store with amnis reducer sets.
   */
  function storeUpdate(set: ReduxSet) {
    store.replaceReducer(combineReducers({ ...intialReducers, ...set.reducers }));
  }

  /**
   * The website provider for a react web application.
   * In development mode, this component will mock the APIs with an in-memory database.
   *
   * @example ```tsx
   * import { websiteCreate } from '@amnis/sys/react';
   *
   * export const Website = websiteCreate();
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
    const [slices, slicesSet] = React.useState<ReduxSet['slices']>({
      ...stateSet.slices,
      ...apiSet.slices,
      ...webSet.slices,
    });

    /**
     * Load a dynamic plugin by it's id
     */
    const pluginLoad = React.useCallback(async (pluginKey: string) => {
      importingSet(true);
      try {
        const pluginIndex = pluginsDynamic.findIndex(
          (pluginDynamic) => pluginDynamic.key === pluginKey,
        );

        /**
         * If the plugin has not been declared when the website system was created, do nothing.
         */
        if (pluginIndex === -1) {
          importingSet(false);
          console.warn(`Plugin "${pluginKey}" has not been delcared.`);
          return;
        }

        /**
         * If the plugin has already been loaded, do nothing.
         */
        if (pluginsBuffer[pluginIndex]) {
          importingSet(false);
          return;
        }

        const pluginImport = await importerPlugin(pluginsDynamic[pluginIndex], ['set']);
        pluginsBuffer.splice(pluginIndex, 1, pluginImport);

        /**
         * Get all the sets from the plugins that have been loaded.
         * This will be used to extend the store.
         */
        const set = pluginSetsMerge(
          pluginsBuffer.filter((p): p is StaticPlugin => !!p),
        );

        if (!set) return;
        slicesSet(set.slices);
        storeUpdate(set);
      } catch (err) {
        console.error(`There was an issue dynamically importing "${pluginKey}".`, err);
      }
      importingSet(false);
    }, []);

    /**
     * Create a memorized value for the context.
     */
    const contextValue = React.useMemo(() => ({
      init: true,
      importing,
      pluginLoad,
    }), [importing, pluginLoad]);

    return (
      <ProviderRR store={store}>
        <WebsiteContext.Provider value={contextValue}>
          <Mocker {...mockerOptions} plugins={pluginsDynamic}>
            <WebsiteApp system={system} hostname={hostname} slices={slices}>
              {children}
            </WebsiteApp>
          </Mocker>
        </WebsiteContext.Provider>
      </ProviderRR>
    );
  };

  return {
    store,
    Provider,
  };
}

export default websiteCreate;
