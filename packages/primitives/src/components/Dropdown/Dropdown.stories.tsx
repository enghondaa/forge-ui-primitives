import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Primitives/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An accessible Dropdown Menu following the [ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).

## Features
- Full keyboard navigation (Arrow keys, Home, End, Escape)
- Closes on outside click and Escape
- Proper \`role="menu"\` and \`role="menuitem"\` ARIA attributes
- Disabled item support
- Separator and label grouping
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  padding: '4px',
  minWidth: '180px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) translateY(40px)',
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

export const Default: Story = {
  render: () => (
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
        Options ▾
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content style={menuStyle}>
          <Dropdown.Item
            style={itemStyle}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f8f9fa')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
          >
            ✏️ Edit
          </Dropdown.Item>
          <Dropdown.Item
            style={itemStyle}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f8f9fa')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
          >
            📋 Duplicate
          </Dropdown.Item>
          <Dropdown.Item
            style={itemStyle}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f8f9fa')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
          >
            🔗 Share
          </Dropdown.Item>
          <Dropdown.Separator style={separatorStyle} />
          <Dropdown.Item
            style={{ ...itemStyle, color: '#dc3545', opacity: 0.5, cursor: 'not-allowed' }}
            disabled
          >
            🗑️ Delete
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};
