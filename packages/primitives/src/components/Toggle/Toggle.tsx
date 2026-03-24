import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { useControllableState } from '../../utils/use-controllable-state';

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  pressed?: boolean | undefined;
  defaultPressed?: boolean | undefined;
  onPressedChange?: ((pressed: boolean) => void) | undefined;
  disabled?: boolean | undefined;
}

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
