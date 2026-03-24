import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Hover/focus tooltip with configurable show/hide delay.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const tooltipStyle: React.CSSProperties = {
  background: '#1a1a1a',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, calc(-50% - 40px))',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 9999,
};

export const Default: Story = {
  render: () => (
    <Tooltip delayDuration={300}>
      <Tooltip.Trigger
        style={{
          padding: '8px 16px',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        Hover or focus me
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content style={tooltipStyle}>
          This is a tooltip!
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  ),
};
