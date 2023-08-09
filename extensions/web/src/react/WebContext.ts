import { noop } from '@amnis/state';
import React from 'react';

export interface WebContextProps {
  crystalizer: boolean;
  crystalizerSet: (value: boolean) => void;
}

export const WebContext = React.createContext<WebContextProps>({
  crystalizer: false,
  crystalizerSet: noop,
});
