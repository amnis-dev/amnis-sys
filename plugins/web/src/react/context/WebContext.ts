import type { Entity, DataSliceGeneric } from '@amnis/state';
import { noop } from '@amnis/state';
import React from 'react';

export type WebContextIderEntities<
  E extends Entity = Entity
> = [entity: E | undefined, prop: keyof E | undefined][];

export type WebContextIder = [
  WebContextIderEntities, React.RefObject<HTMLElement>
];

export type WebContextWebSelect = 'data' | 'component';

export type WebContextIderMap = Record<string, WebContextIder>;

export interface WebContext {
  /**
   * Data slices loaded into the application.
   */
  slices: Record<string, DataSliceGeneric>;

  /**
   * Pushes a localization key or set of keys to request after the application is loaded.
   */
  localePush: (key: readonly string[]) => void;

  /**
   * Whether the UI manager is enabled.
   */
  manager: boolean;

  /**
   * Sets the crytalizer manager state.
   */
  managerSet: (value: boolean) => void;

  /**
   * Push a path location to route the manager.
   */
  managerLocationPush: (path: string) => void;

  /**
   * Sets the web selection state (only useful when the manager is enabled)
   */
  webSelect?: WebContextWebSelect;

  /**
   * Sets the web selection state (only useful when the manager is enabled)
   */
  webSelectSet: (value?: WebContextWebSelect) => void;
}

export const WebContext = React.createContext<WebContext>({
  slices: {},
  localePush: noop,
  manager: false,
  managerSet: noop,
  managerLocationPush: noop,
  webSelect: undefined,
  webSelectSet: noop,
});
