import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './Combobox';

const meta = {
  title: 'Primitives/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Autocomplete combobox with filtering and async search.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruits: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #dee2e6',
  borderRadius: '6px',
  fontSize: '14px',
  width: '280px',
  outline: 'none',
};

const listStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  padding: '4px',
  maxHeight: '240px',
  overflowY: 'auto',
  listStyle: 'none',
  margin: '4px 0 0',
  position: 'absolute',
  width: '280px',
  zIndex: 100,
};

const optionBaseStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

function OptionItem({ opt, index }: { opt: ComboboxOption; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Combobox.Option
      value={opt.value}
      label={opt.label}
      index={index}
      style={{
        ...optionBaseStyle,
        background: hovered ? '#f0f7ff' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}

function DefaultDemo() {
  const [value, setValue] = useState<string | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ position: 'relative' }}>
      {value && (
        <p style={{ marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          Selected: <strong>{value}</strong>
        </p>
      )}
      <Combobox options={fruits} onValueChange={setValue}>
        <Combobox.Input placeholder="Search fruit…" style={inputStyle} />
        {container && (
          <Combobox.Portal container={container}>
            <Combobox.Listbox style={listStyle}>
              {fruits.map((opt, i) => (
                <OptionItem key={opt.value} opt={opt} index={i} />
              ))}
              <Combobox.Empty style={{ padding: '8px 12px', color: '#999', fontSize: '14px' }}>
                No results found
              </Combobox.Empty>
            </Combobox.Listbox>
          </Combobox.Portal>
        )}
      </Combobox>
    </div>
  );
}

function AsyncDemo() {
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  async function handleInputChange(query: string) {
    if (!query) {
      setOptions([]);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setOptions(fruits.filter((f) => f.label.toLowerCase().includes(query.toLowerCase())));
    setLoading(false);
  }

  return (
    <div ref={setContainer} style={{ position: 'relative' }}>
      <Combobox options={options} onInputChange={handleInputChange} debounceMs={300}>
        <Combobox.Input placeholder="Type to search (async)…" style={inputStyle} />
        {container && (
          <Combobox.Portal container={container}>
            <Combobox.Listbox style={listStyle}>
              {loading ? (
                <li
                  style={{
                    padding: '8px 12px',
                    color: '#999',
                    fontSize: '14px',
                    listStyle: 'none',
                  }}
                >
                  Loading…
                </li>
              ) : (
                <>
                  {options.map((opt, i) => (
                    <OptionItem key={opt.value} opt={opt} index={i} />
                  ))}
                  <Combobox.Empty
                    style={{ padding: '8px 12px', color: '#999', fontSize: '14px' }}
                  >
                    No results found
                  </Combobox.Empty>
                </>
              )}
            </Combobox.Listbox>
          </Combobox.Portal>
        )}
      </Combobox>
    </div>
  );
}

export const Default: Story = {
  args: { options: [], children: null },
  render: () => <DefaultDemo />,
};

export const AsyncSearch: Story = {
  args: { options: [], children: null },
  render: () => <AsyncDemo />,
};
