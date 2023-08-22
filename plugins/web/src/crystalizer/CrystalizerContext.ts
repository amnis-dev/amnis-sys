import React from 'react';
import type { WebContextWebSelect } from '@amnis/web/react/context';

export interface CrystalizerContext {
  /**
   * The current selection state of the editor.
   */
  webSelect?: WebContextWebSelect;
}

export const defaultCrystalizerContext: CrystalizerContext = {
  webSelect: undefined,
};

export const CrystalizerContext = React.createContext<CrystalizerContext>(
  defaultCrystalizerContext,
);

export default CrystalizerContext;
