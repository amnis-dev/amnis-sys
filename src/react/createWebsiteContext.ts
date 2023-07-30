import React from 'react';
import { noop } from '@amnis/state';

export interface WebsiteContext {
  /**
   * Whether the website is importing.
   */
  importing: boolean;

  /**
   * The packages to import or have been imported.
   */
  packages: string[];

  /**
   * The dispatch function for adding new packages.
   */
  packagesDispatch: React.Dispatch<string>;
}

export const websiteContextDefault: WebsiteContext = {
  importing: true,
  packages: [],
  packagesDispatch: noop,
};

export function createWebsiteContext(): React.Context<WebsiteContext> {
  return React.createContext(websiteContextDefault);
}

export default createWebsiteContext;
