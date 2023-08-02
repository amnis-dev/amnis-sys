import React from 'react';
import { noop } from '@amnis/state';

export interface WebsiteContext {
  /**
   * Determines whether the website has been initialized.
   */
  init: boolean;

  /**
   * Whether the website is importing a package.
   */
  importing: boolean;

  /**
   * Dispatch a plugin to be imported by it's id.
   */
  pluginLoad: (pluginId: string) => void;
}

export const websiteContextDefault: WebsiteContext = {
  init: false,
  importing: true,
  pluginLoad: noop,
};

export const WebsiteContext = React.createContext(websiteContextDefault);
