import type { DynamicPlugin } from '@amnis/state';

export interface WebsiteCreateMockerOptions {
  /**
   * Enable the mocker for production.
   *
   * @default false
   */
  production?: boolean;
}

export interface WebsiteCreateOptions {
  /**
   * The system this website depends on.
   * If an array is used, the first index in the array is the default system.
   */
  system?: string | string[],

  /**
   * Explicit delcaration of the website hostname for production.
   */
  hostname?: string;

  /**
   * Plugins to be dynamically imported.
   *
   * The plugins are imported on a need-to-use basis, and not in the order they are declared.
   */
  plugins?: DynamicPlugin[],

  /**
   * Mocker options.
   */
  mocker?: WebsiteCreateMockerOptions;
}
