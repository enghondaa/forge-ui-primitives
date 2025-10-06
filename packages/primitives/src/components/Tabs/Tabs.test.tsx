import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';

function TestTabs({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue="a" onValueChange={onValueChange}>
      <Tabs.List aria-label="Test tabs">
        <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
        <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
        <Tabs.Trigger value="c">Tab C</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="a">Panel A content</Tabs.Panel>
      <Tabs.Panel value="b">Panel B content</Tabs.Panel>
      <Tabs.Panel value="c">Panel C content</Tabs.Panel>
    </Tabs>
  );
}

describe('Tabs', () => {
  describe('rendering', () => {
    it('renders the default selected panel', () => {
      render(<TestTabs />);
      expect(screen.getByText('Panel A content')).toBeInTheDocument();
      expect(screen.queryByText('Panel B content')).not.toBeInTheDocument();
    });

    it('renders correct ARIA attributes on tablist', () => {
      render(<TestTabs />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('accessibility', () => {
    it('marks selected tab with aria-selected="true"', () => {
      render(<TestTabs />);
      expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('active tab has tabIndex 0, others have -1', () => {
      render(<TestTabs />);
      expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1');
    });

    it('panel is labelled by its trigger', () => {
      render(<TestTabs />);
      const panel = screen.getByRole('tabpanel');
      const trigger = screen.getByRole('tab', { name: 'Tab A' });
      expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    });
  });

  describe('interaction', () => {
    it('switches panel on tab click', async () => {
      const user = userEvent.setup();
      render(<TestTabs />);
      await user.click(screen.getByRole('tab', { name: 'Tab B' }));
      expect(screen.getByText('Panel B content')).toBeInTheDocument();
      expect(screen.queryByText('Panel A content')).not.toBeInTheDocument();
    });

    it('calls onValueChange when tab is selected', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TestTabs onValueChange={onValueChange} />);
      await user.click(screen.getByRole('tab', { name: 'Tab C' }));
      expect(onValueChange).toHaveBeenCalledWith('c');
    });
  });

  describe('keyboard navigation', () => {
    it('moves to next tab on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<TestTabs />);
      screen.getByRole('tab', { name: 'Tab A' }).focus();
      await user.keyboard('[ArrowRight]');
      expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    });

    it('wraps from last tab to first on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<TestTabs />);
      screen.getByRole('tab', { name: 'Tab C' }).focus();
      await user.keyboard('[ArrowRight]');
      expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
    });

    it('moves to previous tab on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<TestTabs />);
      screen.getByRole('tab', { name: 'Tab B' }).focus();
      await user.keyboard('[ArrowLeft]');
      expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
    });

    it('moves to first tab on Home key', async () => {
      const user = userEvent.setup();
      render(<TestTabs />);
      screen.getByRole('tab', { name: 'Tab C' }).focus();
      await user.keyboard('[Home]');
      expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
    });

    it('moves to last tab on End key', async () => {
      const user = userEvent.setup();
      render(<TestTabs />);
      screen.getByRole('tab', { name: 'Tab A' }).focus();
      await user.keyboard('[End]');
      expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveFocus();
    });
  });
});
