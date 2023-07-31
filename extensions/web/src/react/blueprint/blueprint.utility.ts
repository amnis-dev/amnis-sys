/**
 * Applies the skeleton class if the provided value is falsy.
 */
export function skeleton(value: unknown, className?: string): string {
  let isFalsy = !value;

  if (typeof value === 'string') {
    isFalsy = value.length === 0;
  }

  return `${className || ''} ${isFalsy ? 'bp5-skeleton' : ''}`.trim();
}

export default skeleton;
