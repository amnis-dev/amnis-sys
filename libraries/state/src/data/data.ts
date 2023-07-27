import type { Data, DataOrder } from './data.types.js';

/**
 * Attempts to obtain a human readable name for the given data object.
 * The ID slice key is returned if no name can be found.
 */
export const dataName = <D extends Data & Record<string, any>>(data: D): string => {
  const name = data.name || data.nameDisplay || data.handle || data.title || data.label || data.$id.split(':')[0];
  return name;
};

/**
 * Converts a camel case string to a human readable title case string.
 */
export const dataCamelToTitle = (str: string): string => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Orders an array of data objects by the given order object.
 */
export const dataOrder = <D extends Data>(data: D[], order: DataOrder = ['$id', 'asc']): D[] => {
  const [by, direction] = order;
  const sorted = [...data].sort((a, b) => {
    const aVal = a[by as keyof Data];
    const bVal = b[by as keyof Data];
    if (aVal < bVal) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  return sorted;
};
