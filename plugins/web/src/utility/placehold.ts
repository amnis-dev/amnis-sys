/**
 * Returns the string argument or a placeholder if the argument is undefined.
 */
export function placehold(value: string | undefined, length = 8) {
  return value ?? 'X'.repeat(length);
}

export default placehold;
