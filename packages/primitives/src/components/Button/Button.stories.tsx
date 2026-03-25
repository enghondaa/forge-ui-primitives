import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Polymorphic button with loading/disabled states and full ARIA support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['button', 'a', 'div'],
      description: 'The element type to render as',
    },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    loadingLabel: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
  render: (args) => (
    <Button
      style={{
        padding: '8px 16px',
        background: args.isDisabled || args.isLoading ? '#6c757d' : '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: args.isDisabled || args.isLoading ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        opacity: args.isDisabled || args.isLoading ? 0.7 : 1,
      }}
      {...args}
    >
      {args.isLoading ? 'Loading…' : args.children}
    </Button>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Save changes',
    isLoading: true,
    loadingLabel: 'Saving…',
  },
  render: (args) => (
    <Button
      style={{
        padding: '8px 16px',
        background: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'not-allowed',
        fontSize: '14px',
        opacity: 0.7,
      }}
      {...args}
    />
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    isDisabled: true,
  },
  render: (args) => (
    <Button
      style={{
        padding: '8px 16px',
        background: '#e9ecef',
        color: '#6c757d',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        cursor: 'not-allowed',
        fontSize: '14px',
      }}
      {...args}
    />
  ),
};

export const AsLink: Story = {
  args: {
    as: 'a',
    href: '#',
    children: 'Visit docs',
  },
  render: (args) => (
    <Button
      style={{
        padding: '8px 16px',
        background: '#6f42c1',
        color: '#fff',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'inline-block',
      }}
      {...args}
    />
  ),
};
