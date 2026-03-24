import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Keyboard-navigable tabs with roving tabindex.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const listStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  borderBottom: '2px solid #e9ecef',
  marginBottom: '16px',
};

const triggerStyle = (selected: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  borderBottom: selected ? '2px solid #0070f3' : '2px solid transparent',
  marginBottom: '-2px',
  color: selected ? '#0070f3' : '#666',
  fontWeight: selected ? 600 : 400,
  transition: 'all 0.15s',
});

export const Default: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <Tabs defaultValue="profile">
        <Tabs.List aria-label="Account settings" style={listStyle}>
          {(['profile', 'security', 'notifications'] as const).map((v) => (
            <Tabs.Trigger key={v} value={v}>
              {(args: { 'aria-selected': boolean }) => (
                <span style={triggerStyle(args['aria-selected'])}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </span>
              )}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Panel value="profile" style={{ padding: '8px 0' }}>
          <h3 style={{ margin: '0 0 8px' }}>Profile</h3>
          <p style={{ color: '#666', margin: 0 }}>Manage your public profile information.</p>
        </Tabs.Panel>
        <Tabs.Panel value="security" style={{ padding: '8px 0' }}>
          <h3 style={{ margin: '0 0 8px' }}>Security</h3>
          <p style={{ color: '#666', margin: 0 }}>Update your password and 2FA settings.</p>
        </Tabs.Panel>
        <Tabs.Panel value="notifications" style={{ padding: '8px 0' }}>
          <h3 style={{ margin: '0 0 8px' }}>Notifications</h3>
          <p style={{ color: '#666', margin: 0 }}>Configure your notification preferences.</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', width: '480px' }}>
      <Tabs defaultValue="a" orientation="vertical">
        <Tabs.List
          aria-label="Vertical tabs example"
          style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}
        >
          {['Option A', 'Option B', 'Option C'].map((label, i) => (
            <Tabs.Trigger
              key={i}
              value={String.fromCharCode(97 + i)}
              style={{
                padding: '8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div style={{ flex: 1 }}>
          {['a', 'b', 'c'].map((v, i) => (
            <Tabs.Panel key={v} value={v}>
              <h3 style={{ margin: '0 0 8px' }}>Option {String.fromCharCode(65 + i)}</h3>
              <p style={{ color: '#666', margin: 0 }}>Content for option {v.toUpperCase()}.</p>
            </Tabs.Panel>
          ))}
        </div>
      </Tabs>
    </div>
  ),
};
