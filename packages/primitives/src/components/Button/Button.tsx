import { forwardRef, type ElementType, type ForwardedRef } from 'react';
import type { PolymorphicProps } from '../../utils/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ButtonOwnProps {
  /**
   * Whether the button is in a loading state.
   * Sets aria-disabled and prevents click events when true.
   */
  isLoading?: boolean;
  /**
   * Whether the button is disabled.
   */
  isDisabled?: boolean;
  /**
   * Accessible label for the loading state, read by screen readers.
   * @default "Loading…"
   */
  loadingLabel?: string;
}

export type ButtonProps<TElement extends ElementType = 'button'> = PolymorphicProps<
  TElement,
  ButtonOwnProps
>;

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A polymorphic, headless Button primitive.
 *
 * - Supports rendering as any HTML element or React component via the `as` prop.
 * - Handles loading states with proper ARIA attributes.
 * - Prevents interaction when disabled or loading without hiding from the accessibility tree.
 *
 * @example
 * // Render as a button (default)
 * <Button onClick={handleClick}>Click me</Button>
 *
 * @example
 * // Render as an anchor
 * <Button as="a" href="/home">Go home</Button>
 *
 * @example
 * // Loading state
 * <Button isLoading loadingLabel="Saving…">Save</Button>
 */
function ButtonInner<TElement extends ElementType = 'button'>(
  {
    as,
    isLoading = false,
    isDisabled = false,
    loadingLabel = 'Loading…',
    onClick,
    children,
    ...rest
  }: ButtonProps<TElement>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as ?? 'button') as ElementType;
  const isInert = isDisabled || isLoading;

  function handleClick(event: React.MouseEvent) {
    if (isInert) {
      event.preventDefault();
      return;
    }
    (onClick as React.MouseEventHandler | undefined)?.(event);
  }

  return (
    <Component
      ref={ref}
      // For native buttons, use the disabled attribute; for other elements use aria-disabled
      {...(Component === 'button'
        ? { disabled: isInert }
        : {
            'aria-disabled': isInert || undefined,
            tabIndex: isInert ? -1 : undefined,
          })}
      aria-busy={isLoading || undefined}
      aria-label={isLoading ? loadingLabel : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Component>
  );
}

ButtonInner.displayName = 'Button';

// forwardRef loses generic type parameters, so we cast back.
export const Button = forwardRef(ButtonInner) as <TElement extends ElementType = 'button'>(
  props: ButtonProps<TElement> & { ref?: ForwardedRef<Element> },
) => React.ReactElement | null;
