import { useId as useReactId } from 'react';

/**
 * Generates a stable, unique ID for accessibility attributes.
 * Wraps React's built-in useId with an optional prefix for readability.
 *
 * @example
 * const id = useId('dialog'); // => 'dialog-:r0:'
 */
export function useId(prefix?: string): string {
  const id = useReactId();
  return prefix ? `${prefix}-${id}` : id;
}
