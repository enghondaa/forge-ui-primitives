import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Accessibility checks configuration
      config: {},
      options: {
        checks: { 'color-contrast': { enabled: false } },
        restoreScroll: true,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
