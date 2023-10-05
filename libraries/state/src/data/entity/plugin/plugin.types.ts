import type { SURL } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * An entity object that contains log information.
 */
export interface Plugin extends Data {
  /**
   * Unique key for the plugin.
   */
  key: string;

  /**
   * Name of the plugin.
   */
  name: string;

  /**
   * Description of the plugin.
   */
  description: string;

  /**
   * Author of the plugin.
   */
  author: string;

  /**
   * Import path to the plugin.
   *
   * An empty string indicates the plugin has been hardcoded in.
   */
  path: string;

  /**
   * Website URL for the plugin.
   */
  website?: SURL;
}

/**
 * Root properties excluding the extended entities.
 */
export type PluginRoot = DataRoot<Plugin>;

/**
 * Root properties in order to create a log.
 */
export type PluginMinimal = DataMinimal<Plugin, 'key' | 'name'>;

/**
 * Meta data.
 */
export type PluginMeta = DataMeta<Plugin>;
