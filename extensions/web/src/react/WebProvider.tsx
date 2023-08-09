import React from 'react';
import { WebContext } from './WebContext.js';

export interface WebProviderProps {
  children: React.ReactNode;
}

export const WebProvider: React.FC<WebProviderProps> = ({
  children,
}) => {
  const [crystalizer, crystalizerSet] = React.useState(false);

  const value = React.useMemo(() => ({
    crystalizer,
    crystalizerSet,
  }), [crystalizer]);

  return (
    <WebContext.Provider value={value}>
      {children}
    </WebContext.Provider>
  );
};
