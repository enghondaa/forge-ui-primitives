# @forge-ui/primitives

[![CI](https://github.com/enghondaa/forge-ui-primitives/actions/workflows/ci.yml/badge.svg)](https://github.com/enghondaa/forge-ui-primitives/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@forge-ui/primitives.svg?style=flat)](https://www.npmjs.com/package/@forge-ui/primitives)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

Headless, accessible React primitives. No styles, full keyboard support, WCAG 2.1 AA.

Built because I wanted something smaller than Radix for my own projects — just the core behavior and ARIA, nothing else.

## Install

```bash
npm install @forge-ui/primitives
```

Requires React 17+.

## Components

| Component | Description | ARIA Pattern |
|---|---|---|
| [Button](#button) | Polymorphic button with loading/disabled states | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| [Dialog](#dialog) | Modal with focus trap + scroll lock | [Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) |
| [Dropdown](#dropdown) | Dropdown menu with keyboard nav | [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) |
| [Tabs](#tabs) | Keyboard-navigable tabs | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) |
| [Accordion](#accordion) | Single or multi-open sections | [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) |
| [Tooltip](#tooltip) | Hover/focus tooltip with delay | [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) |
| [Toggle](#toggle) | Two-state toggle button | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| [Combobox](#combobox) | Autocomplete with async support | [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) |

Each component is tree-shakeable via subpath exports:

```tsx
import { Button } from '@forge-ui/primitives/button';
import { Dialog } from '@forge-ui/primitives/dialog';
```

## Usage

### Button

```tsx
import { Button } from '@forge-ui/primitives/button';

<Button onClick={handleSave} className="btn btn-primary">
  Save changes
</Button>

// Loading state
<Button isLoading loadingLabel="Saving…" className="btn">
  Save changes
</Button>

// Renders as <a>
<Button as="a" href="/dashboard" className="btn btn-link">
  Go to dashboard
</Button>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `'button'` | Element or component to render as |
| `isLoading` | `boolean` | `false` | Shows loading state; sets `aria-busy` |
| `isDisabled` | `boolean` | `false` | Disables interaction |
| `loadingLabel` | `string` | `'Loading…'` | Screen reader label during loading |

### Dialog

```tsx
import { Dialog } from '@forge-ui/primitives/dialog';

<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
  <Dialog.Trigger className="btn">Open modal</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="overlay" />
    <Dialog.Content className="modal">
      <Dialog.Title>Confirm deletion</Dialog.Title>
      <Dialog.Description>
        This will permanently delete the item.
      </Dialog.Description>
      <Dialog.Close className="btn">Cancel</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>
```

`Escape` closes the dialog. Focus is trapped within the content.

### Dropdown

```tsx
import { Dropdown } from '@forge-ui/primitives/dropdown';

<Dropdown>
  <Dropdown.Trigger className="btn">Options</Dropdown.Trigger>
  <Dropdown.Portal>
    <Dropdown.Content className="menu">
      <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item disabled>Delete</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

### Tabs

```tsx
import { Tabs } from '@forge-ui/primitives/tabs';

<Tabs defaultValue="overview">
  <Tabs.List aria-label="Sections">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="specs">Specs</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">...</Tabs.Panel>
  <Tabs.Panel value="specs">...</Tabs.Panel>
</Tabs>
```

### Accordion

```tsx
import { Accordion } from '@forge-ui/primitives/accordion';

// Single mode — one section open at a time
<Accordion type="single" collapsible>
  <Accordion.Item value="q1">
    <Accordion.Trigger>What is a headless component?</Accordion.Trigger>
    <Accordion.Panel>A component that provides behavior without styling.</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Multiple mode
<Accordion type="multiple" defaultValue={['a', 'b']}>
  {/* ... */}
</Accordion>
```

### Tooltip

```tsx
import { Tooltip } from '@forge-ui/primitives/tooltip';

<Tooltip delayDuration={500}>
  <Tooltip.Trigger aria-label="Settings">
    <GearIcon />
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content className="tooltip">Open settings</Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>
```

### Toggle

```tsx
import { Toggle } from '@forge-ui/primitives/toggle';

<Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
  <BoldIcon />
</Toggle>
```

### Combobox

```tsx
import { Combobox } from '@forge-ui/primitives/combobox';

<Combobox options={countries} onValueChange={setValue}>
  <Combobox.Input placeholder="Search countries…" />
  <Combobox.Portal>
    <Combobox.Listbox>
      {countries.map((opt, i) => (
        <Combobox.Option key={opt.value} value={opt.value} label={opt.label} index={i} />
      ))}
      <Combobox.Empty>No results</Combobox.Empty>
    </Combobox.Listbox>
  </Combobox.Portal>
</Combobox>
```

Supports async search with debounce via `onInputChange` and `debounceMs` props.

## Utilities

The internal utilities are exported if you need them for custom components:

```tsx
import {
  mergeRefs,
  useControllableState,
  useId,
  useOutsideClick,
  createFocusTrap,
  Keys,
} from '@forge-ui/primitives';
```

## Development

```bash
git clone https://github.com/enghondaa/forge-ui-primitives
cd forge-ui-primitives
npm install

npm test              # run tests
npm run storybook     # component playground
npm run build         # production build
```

## License

[MIT](LICENSE) © Mohand
