# @forge-ui/primitives

[![CI](https://github.com/yourusername/forge-ui-primitives/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/forge-ui-primitives/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@forge-ui/primitives.svg?style=flat)](https://www.npmjs.com/package/@forge-ui/primitives)
[![npm downloads](https://img.shields.io/npm/dm/@forge-ui/primitives.svg)](https://www.npmjs.com/package/@forge-ui/primitives)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@forge-ui/primitives)](https://bundlephobia.com/package/@forge-ui/primitives)
[![Coverage](https://codecov.io/gh/yourusername/forge-ui-primitives/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/forge-ui-primitives)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

**Headless, accessible React component primitives — zero styling opinions, full keyboard support, WCAG 2.1 AA compliant.**

Think [Radix UI](https://www.radix-ui.com/) or [Headless UI](https://headlessui.com/) but smaller, more focused, and fully tree-shakeable. forge-ui gives you the hard parts — ARIA attributes, focus management, keyboard navigation — and stays completely out of your way aesthetically.

---

## Why forge-ui/primitives?

| Feature | forge-ui | Radix UI | Headless UI |
|---|:---:|:---:|:---:|
| Zero styles | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ |
| Compound components | ✅ | ✅ | ✅ |
| Controlled + uncontrolled | ✅ | ✅ | ✅ |
| Focus management | ✅ | ✅ | ✅ |
| Polymorphic `as` prop | ✅ | partial | ❌ |
| Tree-shakeable | ✅ | ✅ | ✅ |
| Bundle size (core) | ~8kB | ~45kB | ~15kB |

---

## Installation

```bash
npm install @forge-ui/primitives
# or
yarn add @forge-ui/primitives
# or
pnpm add @forge-ui/primitives
```

React 17+ and react-dom are peer dependencies:

```bash
npm install react react-dom
```

---

## Components

| Component | Description | ARIA Pattern |
|---|---|---|
| [Button](#button) | Polymorphic button with loading/disabled states | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| [Dialog](#dialog) | Modal with focus trap + scroll lock | [Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) |
| [Dropdown](#dropdown) | Accessible dropdown menu | [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) |
| [Tabs](#tabs) | Keyboard-navigable tabs | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) |
| [Accordion](#accordion) | Single or multi-open accordion | [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) |
| [Tooltip](#tooltip) | Hover/focus tooltip with delay | [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) |
| [Toggle](#toggle) | Two-state toggle button | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| [Combobox](#combobox) | Autocomplete with async support | [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) |

---

## Usage

### Button

A polymorphic button that renders as any element via the `as` prop.

```tsx
import { Button } from '@forge-ui/primitives/button';

// Default — renders as <button>
<Button onClick={handleSave} className="btn btn-primary">
  Save changes
</Button>

// Loading state
<Button isLoading loadingLabel="Saving…" className="btn">
  Save changes
</Button>

// Polymorphic — renders as <a>
<Button as="a" href="/dashboard" className="btn btn-link">
  Go to dashboard
</Button>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `'button'` | Element or component to render as |
| `isLoading` | `boolean` | `false` | Shows loading state; sets `aria-busy` |
| `isDisabled` | `boolean` | `false` | Disables interaction |
| `loadingLabel` | `string` | `'Loading…'` | Screen reader label during loading |

---

### Dialog

Modal dialog with automatic focus trap, body scroll lock, and Escape-to-close.

```tsx
import { Dialog } from '@forge-ui/primitives/dialog';

function ConfirmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Trigger className="btn">Open modal</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="modal">
          <Dialog.Title>Confirm deletion</Dialog.Title>
          <Dialog.Description>
            This will permanently delete the item. Are you sure?
          </Dialog.Description>
          <div className="actions">
            <Dialog.Close className="btn btn-ghost">Cancel</Dialog.Close>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
```

**Keyboard:** `Escape` closes the dialog. Focus is trapped within the content.

---

### Dropdown

Accessible dropdown menu with full keyboard navigation.

```tsx
import { Dropdown } from '@forge-ui/primitives/dropdown';

<Dropdown>
  <Dropdown.Trigger className="btn">
    Options ▾
  </Dropdown.Trigger>
  <Dropdown.Portal>
    <Dropdown.Content className="menu">
      <Dropdown.Item onClick={handleEdit} className="menu-item">Edit</Dropdown.Item>
      <Dropdown.Item onClick={handleDuplicate} className="menu-item">Duplicate</Dropdown.Item>
      <Dropdown.Separator className="separator" />
      <Dropdown.Item disabled className="menu-item menu-item--danger">
        Delete
      </Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

**Keyboard:** `↑`/`↓` navigate items, `Home`/`End` jump to first/last, `Escape` closes.

---

### Tabs

Accessible tabs with roving tabindex keyboard navigation.

```tsx
import { Tabs } from '@forge-ui/primitives/tabs';

<Tabs defaultValue="overview">
  <Tabs.List aria-label="Product information" className="tab-list">
    <Tabs.Trigger value="overview" className="tab">Overview</Tabs.Trigger>
    <Tabs.Trigger value="specs" className="tab">Specifications</Tabs.Trigger>
    <Tabs.Trigger value="reviews" className="tab">Reviews</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview" className="tab-panel">
    <Overview />
  </Tabs.Panel>
  <Tabs.Panel value="specs" className="tab-panel">
    <Specs />
  </Tabs.Panel>
  <Tabs.Panel value="reviews" className="tab-panel">
    <Reviews />
  </Tabs.Panel>
</Tabs>
```

**Keyboard:** `←`/`→` (horizontal) or `↑`/`↓` (vertical) move focus between tabs.

---

### Accordion

Single or multiple-open accordion sections.

```tsx
import { Accordion } from '@forge-ui/primitives/accordion';

// Single — only one section open at a time
<Accordion type="single" collapsible>
  <Accordion.Item value="q1">
    <Accordion.Trigger className="accordion-trigger">
      What is a headless component?
    </Accordion.Trigger>
    <Accordion.Panel className="accordion-panel">
      A headless component provides behavior without styling…
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Multiple — multiple sections can be open simultaneously
<Accordion type="multiple" defaultValue={['a', 'b']}>
  {/* … */}
</Accordion>
```

---

### Tooltip

Accessible tooltip that shows on hover and focus with configurable delay.

```tsx
import { Tooltip } from '@forge-ui/primitives/tooltip';

<Tooltip delayDuration={500}>
  <Tooltip.Trigger className="icon-btn" aria-label="Settings">
    <GearIcon />
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content className="tooltip">
      Open settings
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>
```

---

### Toggle

Two-state toggle button using `aria-pressed`.

```tsx
import { Toggle } from '@forge-ui/primitives/toggle';

function Toolbar() {
  const [bold, setBold] = useState(false);

  return (
    <Toggle
      pressed={bold}
      onPressedChange={setBold}
      aria-label="Bold"
      className={`toolbar-btn ${bold ? 'active' : ''}`}
    >
      <BoldIcon />
    </Toggle>
  );
}
```

---

### Combobox

Accessible autocomplete/combobox with filtering and async search support.

```tsx
import { Combobox } from '@forge-ui/primitives/combobox';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  // …
];

<Combobox options={countries} onValueChange={(v) => console.log(v)}>
  <Combobox.Input
    placeholder="Search countries…"
    className="combobox-input"
  />
  <Combobox.Portal>
    <Combobox.Listbox className="listbox">
      {countries.map((opt, i) => (
        <Combobox.Option
          key={opt.value}
          value={opt.value}
          label={opt.label}
          index={i}
          className="option"
        />
      ))}
      <Combobox.Empty className="empty">No results found</Combobox.Empty>
    </Combobox.Listbox>
  </Combobox.Portal>
</Combobox>
```

**Async search example:**

```tsx
<Combobox
  options={asyncOptions}
  onInputChange={async (query) => {
    const results = await searchAPI(query);
    setAsyncOptions(results);
  }}
  debounceMs={300}
>
  {/* … */}
</Combobox>
```

---

## Utilities

forge-ui/primitives exports its internal utilities for use in custom components:

```tsx
import {
  mergeRefs,
  useControllableState,
  useId,
  useOutsideClick,
  createFocusTrap,
  Keys,
} from '@forge-ui/primitives';

// Merge multiple refs
const ref = mergeRefs(forwardedRef, internalRef);

// Controlled/uncontrolled state
const [value, setValue] = useControllableState({
  value: controlledValue,
  defaultValue: 'default',
  onChange: onValueChange,
});

// Stable accessible IDs
const id = useId('my-component');

// Close on outside click
useOutsideClick(containerRef, () => setOpen(false), isOpen);

// Keyboard constants
if (event.key === Keys.Escape) close();
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and open an issue before submitting large PRs.

```bash
# Clone and install
git clone https://github.com/yourusername/forge-ui-primitives
cd forge-ui-primitives
npm install

# Run tests
npm test

# Start Storybook
npm run storybook

# Build packages
npm run build
```

---

## License

[MIT](LICENSE) © Your Name
