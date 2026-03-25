import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './Toggle';

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Two-state toggle button using aria-pressed.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const getStyle = (pressed: boolean, disabled: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  border: '1px solid',
  borderColor: pressed ? '#0070f3' : '#dee2e6',
  background: pressed ? '#e7f1ff' : '#fff',
  color: pressed ? '#0070f3' : '#333',
  borderRadius: '6px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: pressed ? 600 : 400,
  opacity: disabled ? 0.5 : 1,
  transition: 'all 0.15s',
});

function BoldToggle({ disabled = false }: { disabled?: boolean | undefined }) {
  const [on, setOn] = useState(false);
  return (
    <Toggle
      aria-label="Bold"
      disabled={disabled}
      onPressedChange={setOn}
      style={getStyle(on, disabled)}
    >
      Bold
    </Toggle>
  );
}

function ItalicToggle({ disabled = false }: { disabled?: boolean | undefined }) {
  const [on, setOn] = useState(true);
  return (
    <Toggle
      aria-label="Italic"
      pressed={on}
      disabled={disabled}
      onPressedChange={setOn}
      style={getStyle(on, disabled)}
    >
      Italic
    </Toggle>
  );
}

export const Default: Story = {
  args: { 'aria-label': 'Bold', children: 'B', disabled: false },
  render: (args) => <BoldToggle disabled={args.disabled} />,
};

export const Pressed: Story = {
  args: { pressed: true, 'aria-label': 'Italic', children: 'I', disabled: false },
  render: (args) => <ItalicToggle disabled={args.disabled} />,
};
