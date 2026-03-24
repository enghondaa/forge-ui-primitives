import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders a <button> by default', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders as a different element via the `as` prop', () => {
      render(<Button as="a" href="/home">Home</Button>);
      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/home');
    });

    it('forwards refs correctly', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('passes additional props to the underlying element', () => {
      render(<Button data-testid="my-button" type="submit">Submit</Button>);
      const btn = screen.getByTestId('my-button');
      expect(btn).toHaveAttribute('type', 'submit');
    });
  });

  describe('accessibility', () => {
    it('is focusable by default', () => {
      render(<Button>Focus me</Button>);
      const btn = screen.getByRole('button');
      btn.focus();
      expect(btn).toHaveFocus();
    });

    it('sets aria-busy when isLoading is true', () => {
      render(<Button isLoading>Save</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('sets aria-label to loadingLabel when loading', () => {
      render(<Button isLoading loadingLabel="Saving changes…">Save</Button>);
      expect(screen.getByRole('button', { name: 'Saving changes…' })).toBeInTheDocument();
    });

    it('sets disabled attribute when isDisabled is true on a button element', () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-disabled (not disabled attr) when rendered as a non-button element', () => {
      render(<Button as="div" isDisabled>Disabled</Button>);
      const el = screen.getByText('Disabled');
      expect(el).toHaveAttribute('aria-disabled', 'true');
      expect(el).not.toHaveAttribute('disabled');
    });
  });

  describe('interaction', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button isDisabled onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button isLoading onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('can be activated via keyboard (Enter/Space)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      screen.getByRole('button').focus();
      await user.keyboard('[Enter]');
      await user.keyboard('[Space]');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });
});
