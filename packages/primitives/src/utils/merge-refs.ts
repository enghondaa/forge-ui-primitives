import type { MutableRefObject, Ref, RefCallback } from 'react';

/**
 * Merges multiple React refs into a single callback ref.
 * Supports both callback refs and ref objects.
 *
 * @example
 * const ref = mergeRefs(forwardedRef, localRef, anotherRef);
 * return <div ref={ref} />;
 */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
