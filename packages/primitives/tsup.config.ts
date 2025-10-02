import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    button: 'src/components/Button/index.ts',
    dialog: 'src/components/Dialog/index.ts',
    dropdown: 'src/components/Dropdown/index.ts',
    tabs: 'src/components/Tabs/index.ts',
    accordion: 'src/components/Accordion/index.ts',
    tooltip: 'src/components/Tooltip/index.ts',
    toggle: 'src/components/Toggle/index.ts',
    combobox: 'src/components/Combobox/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
