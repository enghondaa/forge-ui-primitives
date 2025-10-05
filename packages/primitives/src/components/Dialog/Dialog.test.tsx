import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

function TestDialog({
  defaultOpen = false,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay data-testid="overlay" />
        <Dialog.Content data-testid="dialog-content">
          <Dialog.Title>Test dialog</Dialog.Title>
          <Dialog.Description>This is a test dialog.</Dialog.Description>
          <button>Action</button>
          <Dialog.Close data-testid="close-btn">Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

describe('Dialog', () => {
  describe('rendering', () => {
    it('does not render content when closed', () => {
      render(<TestDialog />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders content when defaultOpen is true', () => {
      render(<TestDialog defaultOpen />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders title and description', () => {
      render(<TestDialog defaultOpen />);
      expect(screen.getByText('Test dialog')).toBeInTheDocument();
      expect(screen.getByText('This is a test dialog.')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('dialog has role="dialog" and aria-modal="true"', () => {
      render(<TestDialog defaultOpen />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('dialog is labelled by its title', () => {
      render(<TestDialog defaultOpen />);
      const dialog = screen.getByRole('dialog');
      const title = screen.getByText('Test dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    });

    it('trigger has aria-haspopup="dialog"', () => {
      render(<TestDialog />);
      expect(screen.getByRole('button', { name: 'Open dialog' })).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      );
    });
  });

  describe('keyboard navigation', () => {
    it('closes on Escape key press', async () => {
      const user = userEvent.setup();
      render(<TestDialog defaultOpen />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await user.keyboard('[Escape]');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('closes when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<TestDialog defaultOpen />);
      await user.click(screen.getByTestId('close-btn'));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });
  });

  describe('controlled mode', () => {
    it('calls onOpenChange when closing', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
      await user.keyboard('[Escape]');
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('portal', () => {
    it('renders content in document.body', () => {
      render(<TestDialog defaultOpen />);
      const content = screen.getByTestId('dialog-content');
      expect(content.closest('body')).toBe(document.body);
    });
  });
});
