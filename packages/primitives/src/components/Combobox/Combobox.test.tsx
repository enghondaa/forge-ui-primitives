import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './Combobox';

const options: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

function TestCombobox({
  onValueChange,
  onInputChange,
}: {
  onValueChange?: (v: string | null) => void;
  onInputChange?: (v: string) => void;
}) {
  return (
    <Combobox
      options={options}
      onValueChange={onValueChange}
      onInputChange={onInputChange}
      debounceMs={0}
    >
      <Combobox.Input placeholder="Search fruit…" data-testid="input" />
      <Combobox.Portal>
        <Combobox.Listbox data-testid="listbox">
          {options.map((opt, i) => (
            <Combobox.Option key={opt.value} value={opt.value} label={opt.label} index={i} />
          ))}
          <Combobox.Empty>No results found</Combobox.Empty>
        </Combobox.Listbox>
      </Combobox.Portal>
    </Combobox>
  );
}

describe('Combobox', () => {
  describe('rendering', () => {
    it('renders the input', () => {
      render(<TestCombobox />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('listbox is hidden initially', () => {
      render(<TestCombobox />);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('shows options when typing', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      await user.type(screen.getByRole('combobox'), 'an');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    });

    it('filters options based on input', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      await user.type(screen.getByRole('combobox'), 'cher');
      expect(
        screen.getAllByRole('option').filter((o) => o.textContent !== 'No results found'),
      ).toHaveLength(1);
      expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument();
    });

    it('shows empty state when no matches', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      await user.type(screen.getByRole('combobox'), 'xyz');
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('selects option on click', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TestCombobox onValueChange={onValueChange} />);
      await user.type(screen.getByRole('combobox'), 'app');
      await user.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('updates input value after selection', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      await user.type(screen.getByRole('combobox'), 'app');
      await user.click(screen.getByRole('option', { name: 'Apple' }));
      expect(screen.getByRole('combobox')).toHaveValue('Apple');
    });

    it('closes listbox after selection', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      await user.type(screen.getByRole('combobox'), 'app');
      await user.click(screen.getByRole('option', { name: 'Apple' }));
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    });
  });

  describe('keyboard navigation', () => {
    it('navigates with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      const input = screen.getByRole('combobox');
      await user.type(input, 'a');
      await user.keyboard('[ArrowDown]');
      // active-descendant should be set
      expect(input.getAttribute('aria-activedescendant')).toBeTruthy();
    });

    it('selects with Enter key', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TestCombobox onValueChange={onValueChange} />);
      await user.type(screen.getByRole('combobox'), 'appl');
      await user.keyboard('[ArrowDown]');
      await user.keyboard('[Enter]');
      expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      await user.type(screen.getByRole('combobox'), 'a');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await user.keyboard('[Escape]');
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    });
  });

  describe('accessibility', () => {
    it('input has role="combobox"', () => {
      render(<TestCombobox />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('input has aria-expanded="false" when closed', () => {
      render(<TestCombobox />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('input has aria-expanded="true" when open', async () => {
      const user = userEvent.setup();
      render(<TestCombobox />);
      await user.type(screen.getByRole('combobox'), 'a');
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onInputChange when typing', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();
      render(<TestCombobox onInputChange={onInputChange} />);
      await user.type(screen.getByRole('combobox'), 'app');
      await waitFor(() => expect(onInputChange).toHaveBeenCalledWith('app'));
    });
  });
});
