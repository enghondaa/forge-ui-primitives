import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';

/**
 * Utility type that makes specified keys required.
 */
export type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Utility type that makes all properties optional recursively.
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Polymorphic component props. Allows rendering a component as a different element.
 *
 * @example
 * type ButtonProps = PolymorphicProps<'button', { variant?: 'primary' | 'ghost' }>;
 */
export type PolymorphicProps<
  TElement extends ElementType,
  TProps extends object = object,
> = PropsWithChildren<TProps> &
  Omit<ComponentPropsWithoutRef<TElement>, keyof TProps | 'as'> & {
    as?: TElement;
  };

/**
 * Ref type for polymorphic components.
 */
export type PolymorphicRef<TElement extends ElementType> =
  ComponentPropsWithoutRef<TElement> extends { ref?: infer R } ? R : never;

/**
 * Discriminated union helper for component state.
 */
export type OpenState =
  | { open: true; onClose: () => void }
  | { open: false; onOpen: () => void };

/**
 * Callback that may or may not receive an event argument.
 */
export type MaybeEventCallback<T = void> = T extends void
  ? () => void
  : (event: T) => void;

/**
 * Extract the inner type from a ref object.
 */
export type RefValue<T> = T extends React.RefObject<infer V> ? V : never;

// Re-export React types we use often
export type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FC,
  ForwardRefExoticComponent,
  PropsWithChildren,
  Ref,
  RefObject,
} from 'react';
