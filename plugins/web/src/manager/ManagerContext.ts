import React from 'react';
import { noop } from '@amnis/state';
import type { ManagerLocale, ManagerLocaleCode } from './locale/manager.locale.types.js';

export type ManagerContextRoutes = [title: string, path: string][];

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
   * pathname location of the manager.
   */
  pathname: string | null;

  /**
   * Sets the pathname location of the manager.
   */
  pathnameSet: (pathname: string | null) => void;

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
  locale?: ManagerLocale;
}

export const managerContextDefault: ManagerContext = {
  routes: managerRoutes,
  pathname: null,
  pathnameSet: noop,
  localeLoading: true,
  localeCode: 'en',
  localeCodeSet: noop,
  locale: undefined,
};

export const ManagerContext = React.createContext<ManagerContext>(
  managerContextDefault,
);

export default ManagerContext;
