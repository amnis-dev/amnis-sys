import React from 'react';
import { WebsiteContext } from '../WebsiteContext.js';

/**
 * Imports an AmnisSys Plugin needed for components.
 */
export const usePlugin = (id: string) => {
  const { init, importing, pluginLoad } = React.useContext(WebsiteContext);

  if (!init) throw new Error('Website has not been initialized.');

  React.useEffect(() => {
    pluginLoad(id);
  }, [id]);
  return importing;
};

export default usePlugin;
