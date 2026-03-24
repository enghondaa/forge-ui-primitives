import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dialog } from './Dialog';

const meta = {
  title: 'Primitives/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal dialog with focus trap, scroll lock, and Escape-to-close.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'grid',
  placeItems: 'center',
};

const contentStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  padding: '24px',
  minWidth: '400px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  position: 'relative',
};

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger
        style={{
          padding: '8px 16px',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Open dialog
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle}>
          <Dialog.Content style={contentStyle}>
            <Dialog.Title style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>
              Confirm action
            </Dialog.Title>
            <Dialog.Description style={{ margin: '0 0 24px', color: '#666' }}>
              Are you sure you want to proceed? This action cannot be undone.
            </Dialog.Description>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Dialog.Close
                style={{
                  padding: '8px 16px',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </Dialog.Close>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
          Controlled: {open ? 'Open' : 'Closed'}
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            style={{
              padding: '8px 16px',
              background: '#6f42c1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Open controlled dialog
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay style={overlayStyle}>
              <Dialog.Content style={contentStyle}>
                <Dialog.Title style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>
                  Controlled dialog
                </Dialog.Title>
                <Dialog.Description style={{ margin: '0 0 24px', color: '#666' }}>
                  This dialog&apos;s state is managed externally.
                </Dialog.Description>
                <Dialog.Close
                  style={{
                    padding: '8px 16px',
                    background: '#6f42c1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog>
      </div>
    );
  },
};
