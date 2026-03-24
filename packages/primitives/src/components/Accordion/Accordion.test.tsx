import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

function TestAccordion({
  type = 'single',
  collapsible = false,
  onValueChange,
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  onValueChange?: (v: string | string[] | undefined) => void;
}) {
  const commonProps = {
    onValueChange: onValueChange as (v: string | undefined) => void,
    collapsible,
  };

  return (
    <Accordion type={type as 'single'} {...commonProps}>
      {['a', 'b', 'c'].map((v) => (
        <Accordion.Item key={v} value={v}>
          <Accordion.Trigger>Section {v.toUpperCase()}</Accordion.Trigger>
          <Accordion.Panel>Content for {v}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

describe('Accordion', () => {
  describe('single type', () => {
    it('collapses other items when one is opened', async () => {
      const user = userEvent.setup();
      render(<TestAccordion type="single" />);

      await user.click(screen.getByRole('button', { name: 'Section A' }));
      expect(screen.getByText('Content for a')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Section B' }));
      expect(screen.getByText('Content for b')).toBeInTheDocument();
      expect(screen.queryByText('Content for a')).not.toBeInTheDocument();
    });

    it('does not collapse when collapsible is false', async () => {
      const user = userEvent.setup();
      render(<TestAccordion type="single" />);

      await user.click(screen.getByRole('button', { name: 'Section A' }));
      await user.click(screen.getByRole('button', { name: 'Section A' }));
      expect(screen.getByText('Content for a')).toBeInTheDocument();
    });

    it('collapses when collapsible is true', async () => {
      const user = userEvent.setup();
      render(<TestAccordion type="single" collapsible />);

      await user.click(screen.getByRole('button', { name: 'Section A' }));
      await user.click(screen.getByRole('button', { name: 'Section A' }));
      expect(screen.queryByText('Content for a')).not.toBeInTheDocument();
    });
  });

  describe('multiple type', () => {
    it('allows multiple items open simultaneously', async () => {
      const user = userEvent.setup();
      render(<TestAccordion type="multiple" />);

      await user.click(screen.getByRole('button', { name: 'Section A' }));
      await user.click(screen.getByRole('button', { name: 'Section B' }));

      expect(screen.getByText('Content for a')).toBeInTheDocument();
      expect(screen.getByText('Content for b')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('trigger has aria-expanded="false" when closed', () => {
      render(<TestAccordion type="single" />);
      expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('trigger has aria-expanded="true" when open', async () => {
      const user = userEvent.setup();
      render(<TestAccordion type="single" />);
      await user.click(screen.getByRole('button', { name: 'Section A' }));
      expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('panel has role="region" and is labelled by trigger', async () => {
      const user = userEvent.setup();
      render(<TestAccordion type="single" />);
      await user.click(screen.getByRole('button', { name: 'Section A' }));
      const panel = screen.getByRole('region');
      const trigger = screen.getByRole('button', { name: 'Section A' });
      expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    });
  });
});
