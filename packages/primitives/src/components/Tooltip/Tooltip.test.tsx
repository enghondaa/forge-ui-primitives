import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

function TestTooltip({ delay = 0 }: { delay?: number }) {
  return (
    <Tooltip delayDuration={delay} skipDelayDuration={0}>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('is hidden initially', () => {
    render(<TestTooltip />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on focus', async () => {
    render(<TestTooltip />);
    act(() => {
      screen.getByRole('button', { name: 'Hover me' }).focus();
    });
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });

  it('hides on blur', async () => {
    render(<TestTooltip />);
    const trigger = screen.getByRole('button', { name: 'Hover me' });
    act(() => {
      trigger.focus();
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeInTheDocument());
    act(() => {
      trigger.blur();
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('trigger has aria-describedby pointing to tooltip id', async () => {
    render(<TestTooltip />);
    const trigger = screen.getByRole('button', { name: 'Hover me' });
    act(() => {
      trigger.focus();
    });
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });

  it('tooltip has role="tooltip"', async () => {
    render(<TestTooltip />);
    act(() => {
      screen.getByRole('button').focus();
    });
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });
});
