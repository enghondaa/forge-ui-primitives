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
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const getStyle = (pressed: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  border: '1px solid',
  borderColor: pressed ? '#0070f3' : '#dee2e6',
  background: pressed ? '#e7f1ff' : '#fff',
  color: pressed ? '#0070f3' : '#333',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: pressed ? 600 : 400,
  transition: 'all 0.15s',
});

function BoldToggle() {
  const [on, setOn] = useState(false);
  return (
    <Toggle aria-label="Bold" onPressedChange={setOn} style={getStyle(on)}>
      Bold
    </Toggle>
  );
}

function ItalicToggle() {
  const [on, setOn] = useState(true);
  return (
    <Toggle aria-label="Italic" pressed={on} onPressedChange={setOn} style={getStyle(on)}>
      Italic
    </Toggle>
  );
}

export const Default: Story = {
  args: { 'aria-label': 'Bold', children: 'B' },
  render: () => <BoldToggle />,
};

export const Pressed: Story = {
  args: { pressed: true, 'aria-label': 'Italic', children: 'I' },
  render: () => <ItalicToggle />,
};
