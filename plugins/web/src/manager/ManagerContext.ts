import React from 'react';
import { noop } from '@amnis/state';
import type { ManagerLocale, ManagerLocaleCode } from './locale/manager.locale.types.js';

export interface ManagerContext {
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

export const defaultManagerContext: ManagerContext = {
  pathname: null,
  pathnameSet: noop,
  localeLoading: true,
  localeCode: 'en',
  localeCodeSet: noop,
  locale: undefined,
};

export const ManagerContext = React.createContext<ManagerContext>(
  defaultManagerContext,
);

export default ManagerContext;
