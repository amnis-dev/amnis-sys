import React from 'react';
import { noop } from '@amnis/state';
import type { ManagerLocaleCode } from './locale/manager.locale.types.js';

export type ManagerContextRoutes = [title: string, path: string][];

export interface ManagerContextLocation {
  url: string | undefined;
  path: string | null;
  hash: string | null;
  crumbs: string[];
  page: string | null;
}

const managerRoutes: ManagerContextRoutes = [
  ['web:manager:route_index', '/'],
  ['web:manager:route_administration', '/administration'],
  ['web:manager:route_accounts', '/accounts'],
  ['web:manager:route_localization', '/localization'],
  ['web:manager:route_entities', '/entities'],
  ['web:manager:route_save', '/save'],
];

export interface ManagerContext {
  /**
   * Manager routes.
   */
  routes: [title: string, path: string][];

  /**
   * Route location data.
   */
  location: ManagerContextLocation;

  /**
   * Pushes a path to the location history.
   */
  locationPush: (path: string | null) => void;

  /**
   * The load status to locale data.
   */
  localeLoading: boolean;

  /**
   * The current selection state of the editor.
   */
  localeCode: ManagerLocaleCode;

  /**
   * Sets the locale code.
   */
  localeCodeSet: (localeCode: ManagerLocaleCode) => void;

  /**
   * The current selection state of the editor.
   */
  locale?: Record<string, string>;
}

export const managerContextDefault: ManagerContext = {
  routes: managerRoutes,

  location: {
    url: undefined,
    path: null,
    hash: null,
    crumbs: [],
    page: null,
  },
  locationPush: noop,

  localeLoading: true,
  localeCode: 'en',
  localeCodeSet: noop,
  locale: undefined,
};

export const ManagerContext = React.createContext<ManagerContext>(
  managerContextDefault,
);

export default ManagerContext;
