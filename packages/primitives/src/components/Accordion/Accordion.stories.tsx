import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Primitives/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Single or multi-open accordion sections.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: 'what',
    question: 'What is a headless component library?',
    answer:
      'A headless component library provides behavior, accessibility, and state management without any styling. You bring your own styles, giving you complete design control.',
  },
  {
    value: 'why',
    question: 'Why use @forge-ui/primitives?',
    answer:
      'forge-ui/primitives gives you battle-tested accessibility patterns and keyboard navigation out of the box, so you can focus on building great UIs rather than ARIA attributes.',
  },
  {
    value: 'how',
    question: 'How do I style the components?',
    answer:
      'Apply any CSS solution you like — Tailwind, CSS Modules, styled-components, vanilla CSS. Each component renders semantic HTML elements you can target directly.',
  },
];

const triggerStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #e9ecef',
  textAlign: 'left',
  fontSize: '15px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const panelStyle: React.CSSProperties = {
  padding: '16px',
  fontSize: '14px',
  color: '#555',
  lineHeight: 1.6,
  borderBottom: '1px solid #e9ecef',
};

export const Single: Story = {
  args: { type: 'single', children: null },
  render: () => (
    <div
      style={{
        width: '480px',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Accordion type="single" collapsible>
        {items.map(({ value, question, answer }) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Trigger style={triggerStyle}>{question}</Accordion.Trigger>
            <Accordion.Panel style={panelStyle}>{answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  args: { type: 'multiple', children: null },
  render: () => (
    <div
      style={{
        width: '480px',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Accordion type="multiple">
        {items.map(({ value, question, answer }) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Trigger style={triggerStyle}>{question}</Accordion.Trigger>
            <Accordion.Panel style={panelStyle}>{answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  ),
};
