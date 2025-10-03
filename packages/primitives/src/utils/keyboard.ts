/**
 * Keyboard key constants for consistent usage across components.
 */
export const Keys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  Backspace: 'Backspace',
  Delete: 'Delete',
} as const;

export type Key = (typeof Keys)[keyof typeof Keys];

/**
 * Checks if a keyboard event matches the given key.
 */
export function isKey(event: KeyboardEvent | React.KeyboardEvent, key: Key): boolean {
  return event.key === key;
}

/**
 * Returns the next focusable index, wrapping around at the boundaries.
 */
export function getNextIndex(currentIndex: number, length: number): number {
  return (currentIndex + 1) % length;
}

/**
 * Returns the previous focusable index, wrapping around at the boundaries.
 */
export function getPrevIndex(currentIndex: number, length: number): number {
  return (currentIndex - 1 + length) % length;
}

/**
 * Handles roving tabindex keyboard navigation.
 */
export function handleRovingTabIndex(
  event: React.KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: 'horizontal' | 'vertical' | 'both' = 'vertical',
): number {
  const { key } = event;
  let nextIndex = currentIndex;

  const isVertical = orientation === 'vertical' || orientation === 'both';
  const isHorizontal = orientation === 'horizontal' || orientation === 'both';

  if (isVertical && key === Keys.ArrowDown) {
    nextIndex = getNextIndex(currentIndex, items.length);
  } else if (isVertical && key === Keys.ArrowUp) {
    nextIndex = getPrevIndex(currentIndex, items.length);
  } else if (isHorizontal && key === Keys.ArrowRight) {
    nextIndex = getNextIndex(currentIndex, items.length);
  } else if (isHorizontal && key === Keys.ArrowLeft) {
    nextIndex = getPrevIndex(currentIndex, items.length);
  } else if (key === Keys.Home) {
    nextIndex = 0;
  } else if (key === Keys.End) {
    nextIndex = items.length - 1;
  } else {
    return currentIndex;
  }

  event.preventDefault();
  const nextItem = items[nextIndex];
  nextItem?.focus();
  return nextIndex;
}

// React import needed for React.KeyboardEvent type
import type React from 'react';
