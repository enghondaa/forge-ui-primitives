import type { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Primitives/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dropdown menu with full keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: '4px',
  background: '#fff',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  padding: '4px',
  minWidth: '180px',
  zIndex: 100,
};

const itemStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  outline: 'none',
};

const separatorStyle: React.CSSProperties = {
  height: '1px',
  background: '#e9ecef',
  margin: '4px 0',
};

function DropdownDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <Dropdown>
        <Dropdown.Trigger
          style={{
            padding: '8px 16px',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Options &#9662;
        </Dropdown.Trigger>
        <Dropdown.Portal container={containerRef.current ?? undefined}>
          <Dropdown.Content style={menuStyle}>
            <Dropdown.Item
              style={itemStyle}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f8f9fa')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              style={itemStyle}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f8f9fa')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
            >
              Duplicate
            </Dropdown.Item>
            <Dropdown.Item
              style={itemStyle}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f8f9fa')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
            >
              Share
            </Dropdown.Item>
            <Dropdown.Separator style={separatorStyle} />
            <Dropdown.Item
              style={{ ...itemStyle, color: '#dc3545', opacity: 0.5, cursor: 'not-allowed' }}
              disabled
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown>
    </div>
  );
}

export const Default: Story = {
  args: { children: null },
  render: () => <DropdownDemo />,
};
