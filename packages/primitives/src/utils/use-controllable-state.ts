import { useCallback, useRef, useState } from 'react';

type UseControllableStateParams<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

/**
 * Manages state that can be either controlled (externally managed) or
 * uncontrolled (internally managed), following the React controlled/uncontrolled pattern.
 *
 * @example
 * // Uncontrolled usage (internal state)
 * const [open, setOpen] = useControllableState({ defaultValue: false });
 *
 * // Controlled usage (external state)
 * const [open, setOpen] = useControllableState({ value: isOpen, onChange: onOpenChange });
 */
export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T | undefined, (next: T) => void] {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultValue);

  // Track whether the component has ever been controlled to warn about switching
  const wasControlled = useRef(isControlled);
  if (process.env.NODE_ENV !== 'production') {
    if (wasControlled.current !== isControlled) {
      console.warn(
        `[forge-ui] A component is changing from ${wasControlled.current ? 'controlled' : 'uncontrolled'} to ${isControlled ? 'controlled' : 'uncontrolled'}. ` +
          'This is not recommended. Choose controlled or uncontrolled for the lifetime of the component.',
      );
    }
  }

  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}
