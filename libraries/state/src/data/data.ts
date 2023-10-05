import type { Data, DataOrder } from './data.types.js';

/**
 * Attempts to obtain a human readable string for the given data.
 */
export function dataName(data: any): string {
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'number') {
    return data.toString();
  }
  if (typeof data === 'boolean') {
    return data.toString();
  }
  if (typeof data === 'object' && !!data && !Array.isArray(data)) {
    const name = data.name || data.nameDisplay || data.handle || data.title || data.label || data.$id?.split(':')[0] || '[Object]';
    return name;
  }
  if (Array.isArray(data)) {
    return '[Array]';
  }
  return '[Unknown]';
}

type DataTypeOption = 'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'array';
type DataTypeReturn = string | number | boolean | undefined | object | any[];

/**
 * Return a default value for the given data type.
 */
export function dataDefault(type: DataTypeOption): DataTypeReturn {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'object':
      return {};
    case 'array':
      return [];
    default:
      return undefined;
  }
}

/**
 * Return a default value for the given data type from a variable.
 */
export function dataDefaultFrom(value: any) {
  const type = Array.isArray(value) ? 'array' : typeof value;

  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'object':
      return {};
    case 'array':
      return [];
    default:
      return undefined;
  }
}

/**
 * Converts a camel case string to a human readable title case string.
 */
export function dataCamelToTitle(str: string): string {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Orders an array of data objects by the given order object.
 */
export function dataOrder<D extends Data>(data: D[], order: DataOrder = ['$id', 'asc']): D[] {
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
}
