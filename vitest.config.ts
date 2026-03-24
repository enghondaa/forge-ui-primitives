import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/*/src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        'packages/*/src/**/*.stories.{ts,tsx}',
        'packages/*/src/**/index.ts',
        'packages/*/src/**/*.d.ts',
      ],
      thresholds: {
        lines: 85,
        functions: 80,
        branches: 75,
        statements: 85,
      },
    },
  },
});
