/**
 * Camel Casing
 *
 * @example `camelCase`
 */
export function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * Snake Casing
 *
 * @example `snake_case`
 */
export function snakeize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : `_${match.toLowerCase()}`;
  });
}

/**
 * Pascal Casing
 *
 * @example `PascalCase`
 */
export function pascalize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
    if (+match === 0) return '';
    return match.toUpperCase();
  });
}

/**
 * Kabab Casing
 *
 * @example `kabab-case`
 */
export function kababize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : `-${match.toLowerCase()}`;
  });
}

/**
 * Title Casing
 *
 * @example `Title Case`
 */
export function titleize(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .replace(/[_-]+/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()); // Capitalize the first letter of each word
}
