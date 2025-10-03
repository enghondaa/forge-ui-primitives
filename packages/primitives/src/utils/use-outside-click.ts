import { useEffect, type RefObject } from 'react';

/**
 * Calls the handler when a click occurs outside the referenced element.
 * Useful for closing dropdowns, tooltips, and dialogs.
 *
 * @example
 * useOutsideClick(menuRef, () => setOpen(false), isOpen);
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    function listener(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
