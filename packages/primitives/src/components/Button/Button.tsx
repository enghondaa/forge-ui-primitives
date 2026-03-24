import { forwardRef, type ElementType, type ForwardedRef } from 'react';
import type { PolymorphicProps } from '../../utils/types';

export interface ButtonOwnProps {
  /** Sets aria-disabled and prevents clicks when true. */
  isLoading?: boolean;
  isDisabled?: boolean;
  /** Screen reader label shown during loading. @default "Loading…" */
  loadingLabel?: string;
}

export type ButtonProps<TElement extends ElementType = 'button'> = PolymorphicProps<
  TElement,
  ButtonOwnProps
>;

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
      // Native buttons get `disabled`; everything else gets aria-disabled
      {...(Component === 'button'
        ? { disabled: isInert }
        : {
            'aria-disabled': isInert || undefined,
            tabIndex: isInert ? -1 : 0,
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
