/**
 * Selector for all focusable elements within a container.
 */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'details > summary',
].join(', ');

/**
 * Returns all focusable elements within a container, in DOM order.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]'),
  );
}

/**
 * Returns the first and last focusable elements within a container.
 */
export function getFocusBounds(container: HTMLElement): {
  first: HTMLElement | null;
  last: HTMLElement | null;
} {
  const focusable = getFocusableElements(container);
  return {
    first: focusable[0] ?? null,
    last: focusable[focusable.length - 1] ?? null,
  };
}

/**
 * Creates a focus trap within a container element.
 * Returns a cleanup function to remove the trap.
 *
 * @example
 * const cleanup = createFocusTrap(dialogRef.current, { initialFocus: closeButtonRef.current });
 * return cleanup; // call in useEffect cleanup
 */
export function createFocusTrap(
  container: HTMLElement,
  options: {
    initialFocus?: HTMLElement | null;
    returnFocus?: HTMLElement | null;
  } = {},
): () => void {
  const { initialFocus, returnFocus } = options;
  const previouslyFocused = returnFocus ?? (document.activeElement as HTMLElement | null);

  // Focus initial element or first focusable
  requestAnimationFrame(() => {
    const target = initialFocus ?? getFocusBounds(container).first;
    target?.focus();
  });

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const { first, last } = getFocusBounds(container);
    if (!first || !last) return;

    if (event.shiftKey) {
      // Shift+Tab: if focus is on first element, wrap to last
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if focus is on last element, wrap to first
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    // Restore focus to the element that triggered the trap
    requestAnimationFrame(() => {
      previouslyFocused?.focus();
    });
  };
}

/**
 * Hook-friendly version: returns trap/release functions.
 */
export function useFocusTrapHandlers(container: HTMLElement | null) {
  let cleanup: (() => void) | null = null;

  return {
    trap(options?: { initialFocus?: HTMLElement | null }) {
      if (!container) return;
      cleanup = createFocusTrap(container, options);
    },
    release() {
      cleanup?.();
      cleanup = null;
    },
  };
}
