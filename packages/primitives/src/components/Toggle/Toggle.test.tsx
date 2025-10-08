import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('starts unpressed by default', () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('toggles pressed state on click', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold">B</Toggle>);
    const btn = screen.getByRole('button', { name: 'Bold' });
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onPressedChange with new state', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="Bold" onPressedChange={onPressedChange}>B</Toggle>);
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled pressed state', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="Bold" pressed={false} onPressedChange={onPressedChange}>B</Toggle>);
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    // Controlled — external value doesn't change
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="Bold" disabled onPressedChange={onPressedChange}>B</Toggle>);
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('sets data-state attribute', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold">B</Toggle>);
    const btn = screen.getByRole('button', { name: 'Bold' });
    expect(btn).toHaveAttribute('data-state', 'off');
    await user.click(btn);
    expect(btn).toHaveAttribute('data-state', 'on');
  });
});
