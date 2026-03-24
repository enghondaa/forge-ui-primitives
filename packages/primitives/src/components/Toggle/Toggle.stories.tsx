import type { Meta, StoryObj } from '@storybook/react';
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

export const Default: Story = {
  args: { 'aria-label': 'Bold', children: 'B' },
  render: (args) => (
    <Toggle {...args} style={getStyle(false)}>
      Bold
    </Toggle>
  ),
};

export const Pressed: Story = {
  args: { pressed: true, 'aria-label': 'Italic', children: 'I' },
  render: (args) => (
    <Toggle {...args} style={getStyle(true)}>
      Italic
    </Toggle>
  ),
};
