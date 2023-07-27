import type { App } from './app.types.js';
import { localStorage } from '../../localstorage.js';

/**
 * Reducer key for the application state.
 */
export const appKey = 'app';

/**
 * Stores app data.
 */
let app: App;

/**
 * Initializes the application data.
 */
const appInitialState = (): App => {
  const location = typeof window === 'object' ? window.location.pathname : '/';

  const appDefault: App = {
    location,
    systems: {},
  };

  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    appDefault.systems = {
      Local: 'http://localhost:3000/api/system',
    };
    appDefault.systemDefault = 'Local';
  }

  const appStored = JSON.parse(localStorage().getItem(`state-${appKey}`) ?? '{}');

  return { ...appDefault, ...appStored };
};

/**
 * Get the application data.
 */
export const appGet = (): App => {
  if (!app) {
    app = appInitialState();
  }
  return app;
};
