import type { Entity } from '@amnis/state';
import { noop } from '@amnis/state';
import React from 'react';

export type WebContextIderEntities<
  E extends Entity = Entity
> = [entity: E | undefined, prop: keyof E | undefined][];

export type WebContextIder = [
  WebContextIderEntities, React.RefObject<HTMLElement>
];

export type WebContextIderMap = Record<string, WebContextIder>;

export interface WebContextProps {
  /**
   * Whether the crystalizer manager is enabled.
   */
  crystalizer: boolean;

  /**
   * Sets the crytalizer manager state.
   */
  crystalizerSet: (value: boolean) => void;

  /**
   * List of registered ID'd element references.
   */
  iders: WebContextIderMap;

  /**
   * Adds an ID'd element reference to the list.
   */
  idersAdd: (id: string, ider: WebContextIder) => void;

  /**
   * Removes an ID'd element reference from the list.
   */
  idersRemove: (id: string) => void;
}

export const WebContext = React.createContext<WebContextProps>({
  crystalizer: false,
  crystalizerSet: noop,
  iders: {},
  idersAdd: noop,
  idersRemove: noop,
});
