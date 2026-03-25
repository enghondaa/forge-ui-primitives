import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const listStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  borderBottom: '2px solid #e9ecef',
  marginBottom: '16px',
};

const baseTriggerStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  marginBottom: '-2px',
  transition: 'all 0.15s',
};

const tabValues = ['profile', 'security', 'notifications'] as const;

function HorizontalDemo() {
  const [selected, setSelected] = useState<string>('profile');
  return (
    <div style={{ width: '480px' }}>
      <Tabs value={selected} onValueChange={setSelected}>
        <Tabs.List aria-label="Account settings" style={listStyle}>
          {tabValues.map((v) => (
            <Tabs.Trigger
              key={v}
              value={v}
              style={{
                ...baseTriggerStyle,
                borderBottom: selected === v ? '2px solid #0070f3' : '2px solid transparent',
                color: selected === v ? '#0070f3' : '#666',
                fontWeight: selected === v ? 600 : 400,
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
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
  );
}

function VerticalDemo() {
  const [selected, setSelected] = useState<string>('a');
  return (
    <div style={{ display: 'flex', gap: '24px', width: '480px' }}>
      <Tabs value={selected} onValueChange={setSelected} orientation="vertical">
        <Tabs.List
          aria-label="Vertical tabs example"
          style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}
        >
          {['Option A', 'Option B', 'Option C'].map((label, i) => {
            const val = String.fromCharCode(97 + i);
            return (
              <Tabs.Trigger
                key={val}
                value={val}
                style={{
                  padding: '8px 12px',
                  border: '1px solid',
                  borderColor: selected === val ? '#0070f3' : '#dee2e6',
                  borderRadius: '6px',
                  background: selected === val ? '#e7f1ff' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {label}
              </Tabs.Trigger>
            );
          })}
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
  );
}

export const Default: Story = {
  args: { children: null, orientation: 'horizontal' },
  render: () => <HorizontalDemo />,
};

export const Vertical: Story = {
  args: { children: null, orientation: 'vertical' },
  render: () => <VerticalDemo />,
};
