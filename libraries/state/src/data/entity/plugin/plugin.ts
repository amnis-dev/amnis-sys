import { uid } from '../../../core/index.js';
import type { Data } from '../../data.types.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { PluginMinimal, PluginRoot, Plugin } from './plugin.types.js';

const pluginKey = 'plugin';

export const pluginRoot: PluginRoot = {
  key: '@plugin/unknown',
  name: 'Unknown Plugin',
  description: 'This plugin has not been given a description.',
  author: 'Unknown Author',
  path: '',
};

/**
 * Strips any extension of a plugin to it's root.
 */
export function pluginPurify<P extends Plugin | Omit<Plugin, keyof Data>>(plugin: P): Plugin {
  const {
    $id,
    key,
    name,
    description,
    author,
    path,
  } = plugin as Plugin & { $id?: string };

  return {
    $id: $id || uid(pluginKey),
    key,
    name,
    description,
    author,
    path,
  };
}

/**
 * Creates a plugin entry.
 */
export function pluginCreate(plugin: PluginMinimal): Plugin {
  return {
    ...pluginRoot,
    ...plugin,
    $id: uid(pluginKey),
  };
}

export const pluginSlice = entitySliceCreate({
  key: pluginKey,
  create: pluginCreate,
});
