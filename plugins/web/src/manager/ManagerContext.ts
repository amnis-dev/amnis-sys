import React from 'react';
import type { WebContextWebSelect } from '@amnis/web/react/context';

export interface ManagerContext {
  /**
   * The current selection state of the editor.
   */
  webSelect?: WebContextWebSelect;
}

export const defaultManagerContext: ManagerContext = {
  webSelect: undefined,
};

export const ManagerContext = React.createContext<ManagerContext>(
  defaultManagerContext,
);

export default ManagerContext;
