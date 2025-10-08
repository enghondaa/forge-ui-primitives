import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { useControllableState } from '../../utils/use-controllable-state';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  /** Whether the toggle is pressed (controlled). */
  pressed?: boolean;
  /** Default pressed state (uncontrolled). @default false */
  defaultPressed?: boolean;
  /** Fired when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  /** Whether the toggle is disabled. */
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A two-state toggle button following the
 * [ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
 *
 * - Uses `aria-pressed` to communicate state to assistive technology
 * - Supports controlled and uncontrolled modes
 * - Zero styling — apply classes/styles as needed
 *
 * @example
 * <Toggle
 *   defaultPressed={false}
 *   onPressedChange={(pressed) => console.log(pressed)}
 *   aria-label="Bold"
 * >
 *   <BoldIcon />
 * </Toggle>
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      disabled = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [pressed = false, setPressed] = useControllableState({
      value: controlledPressed,
      defaultValue: defaultPressed,
      onChange: onPressedChange,
    });

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={pressed}
        disabled={disabled}
        data-state={pressed ? 'on' : 'off'}
        onClick={(e) => {
          if (!disabled) {
            onClick?.(e);
            setPressed(!pressed);
          }
        }}
        {...props}
      />
    );
  },
);

Toggle.displayName = 'Toggle';
