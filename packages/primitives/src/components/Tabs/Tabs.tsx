import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Keys } from '../../utils/keyboard';
import { useControllableState } from '../../utils/use-controllable-state';
import { useId } from '../../utils/use-id';

// ─── Context ─────────────────────────────────────────────────────────────────

interface TabsContextValue {
  selectedValue: string | undefined;
  onSelect: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(name: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`\`${name}\` must be inside a \`<Tabs>\`.`);
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface TabsRootProps {
  /** The currently selected tab value (controlled). */
  value?: string;
  /** The default selected tab value (uncontrolled). */
  defaultValue?: string;
  /** Fired when the selected tab changes. */
  onValueChange?: (value: string) => void;
  /** Layout orientation of the tab list. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}

export const TabsRoot: FC<TabsRootProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  children,
}) => {
  const baseId = useId('tabs');
  const [selectedValue, setSelectedValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <TabsContext.Provider
      value={{ selectedValue, onSelect: setSelectedValue, orientation, baseId }}
    >
      {children}
    </TabsContext.Provider>
  );
};

TabsRoot.displayName = 'Tabs';

// ─── Tab List ─────────────────────────────────────────────────────────────────

export type TabsListProps = ComponentPropsWithoutRef<'div'>;

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ onKeyDown, ...props }, ref) => {
    const { orientation } = useTabsContext('Tabs.List');
    const listRef = useRef<HTMLDivElement>(null);

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(e);
      const list = (ref as React.RefObject<HTMLDivElement>)?.current ?? listRef.current;
      if (!list) return;

      const tabs = Array.from(
        list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
      );
      const currentIndex = tabs.findIndex((t) => t === document.activeElement);
      if (currentIndex === -1) return;

      const isHorizontal = orientation === 'horizontal';
      const nextKey = isHorizontal ? Keys.ArrowRight : Keys.ArrowDown;
      const prevKey = isHorizontal ? Keys.ArrowLeft : Keys.ArrowUp;

      let nextIndex = currentIndex;
      if (e.key === nextKey) nextIndex = (currentIndex + 1) % tabs.length;
      else if (e.key === prevKey) nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (e.key === Keys.Home) nextIndex = 0;
      else if (e.key === Keys.End) nextIndex = tabs.length - 1;
      else return;

      e.preventDefault();
      tabs[nextIndex]?.focus();
    }

    return (
      <div
        ref={ref ?? listRef}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

TabsList.displayName = 'Tabs.List';

// ─── Tab ─────────────────────────────────────────────────────────────────────

export interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {
  /** Unique value that identifies this tab. */
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, onClick, ...props }, ref) => {
    const { selectedValue, onSelect, baseId } = useTabsContext('Tabs.Trigger');
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        id={`${baseId}-tab-${value}`}
        aria-controls={`${baseId}-panel-${value}`}
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
        onClick={(e) => {
          onClick?.(e);
          onSelect(value);
        }}
        {...props}
      />
    );
  },
);

TabsTrigger.displayName = 'Tabs.Trigger';

// ─── Tab Panel ────────────────────────────────────────────────────────────────

export interface TabsPanelProps extends ComponentPropsWithoutRef<'div'> {
  /** Must match the value of the corresponding `<Tabs.Trigger>`. */
  value: string;
  /** Whether to keep the panel in the DOM when not selected. @default false */
  forceMount?: boolean;
}

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value, forceMount = false, ...props }, ref) => {
    const { selectedValue, baseId } = useTabsContext('Tabs.Panel');
    const isSelected = selectedValue === value;

    if (!forceMount && !isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
        tabIndex={0}
        hidden={forceMount ? !isSelected : undefined}
        {...props}
      />
    );
  },
);

TabsPanel.displayName = 'Tabs.Panel';

// ─── Compound Export ─────────────────────────────────────────────────────────

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
});
