import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';

function TestDropdown({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <Dropdown>
      <Dropdown.Trigger>Options</Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content data-testid="menu">
          <Dropdown.Item onClick={onItemClick}>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item disabled>Delete (disabled)</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  );
}

describe('Dropdown', () => {
  describe('rendering', () => {
    it('menu is hidden initially', () => {
      render(<TestDropdown />);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      render(<TestDropdown />);
      await user.click(screen.getByRole('button', { name: 'Options' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('trigger has aria-haspopup="menu"', () => {
      render(<TestDropdown />);
      expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute(
        'aria-haspopup',
        'menu',
      );
    });

    it('trigger aria-expanded is false when closed', () => {
      render(<TestDropdown />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('trigger aria-expanded is true when open', async () => {
      const user = userEvent.setup();
      render(<TestDropdown />);
      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('disabled item has aria-disabled', async () => {
      const user = userEvent.setup();
      render(<TestDropdown />);
      await user.click(screen.getByRole('button'));
      const disabled = screen.getByRole('menuitem', { name: 'Delete (disabled)' });
      expect(disabled).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('keyboard navigation', () => {
    it('closes on Escape', async () => {
      const user = userEvent.setup();
      render(<TestDropdown />);
      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      await user.keyboard('[Escape]');
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    });

    it('navigates items with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<TestDropdown />);
      await user.click(screen.getByRole('button'));
      const items = screen.getAllByRole('menuitem');
      items[0]?.focus();
      await user.keyboard('[ArrowDown]');
      expect(items[1]).toHaveFocus();
    });
  });

  describe('interaction', () => {
    it('calls onClick handler on item click', async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(<TestDropdown onItemClick={onItemClick} />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
      expect(onItemClick).toHaveBeenCalledOnce();
    });

    it('closes menu after item click', async () => {
      const user = userEvent.setup();
      render(<TestDropdown />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    });

    it('does not call onClick for disabled items', async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(<TestDropdown />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: 'Delete (disabled)' }));
      expect(onItemClick).not.toHaveBeenCalled();
    });
  });
});
