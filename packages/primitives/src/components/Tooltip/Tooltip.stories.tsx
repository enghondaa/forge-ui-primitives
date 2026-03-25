import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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
  position: 'absolute',
  bottom: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  marginBottom: '8px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 9999,
};

function TooltipDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ position: 'relative', display: 'inline-block' }}>
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
        {container && (
          <Tooltip.Portal container={container}>
            <Tooltip.Content style={tooltipStyle}>This is a tooltip!</Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip>
    </div>
  );
}

export const Default: Story = {
  args: { children: null },
  render: () => <TooltipDemo />,
};
