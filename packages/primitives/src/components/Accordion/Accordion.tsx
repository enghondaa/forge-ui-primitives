import {
  createContext,
  forwardRef,
  useCallback,
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

export type AccordionType = 'single' | 'multiple';

// Discriminated union so TS can narrow single vs. multiple at the call site
export type AccordionRootProps =
  | {
      type: 'single';
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string | undefined) => void;
      collapsible?: boolean;
      children: ReactNode;
    }
  | {
      type: 'multiple';
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
      collapsible?: never;
      children: ReactNode;
    };

interface AccordionContextValue {
  isExpanded: (value: string) => boolean;
  toggle: (value: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(name: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error(`\`${name}\` must be inside a \`<Accordion>\`.`);
  return ctx;
}

interface AccordionItemContextValue {
  value: string;
  expanded: boolean;
  triggerId: string;
  panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(name: string): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error(`\`${name}\` must be inside a \`<Accordion.Item>\`.`);
  return ctx;
}

export const AccordionRoot: FC<AccordionRootProps> = (props) => {
  const baseId = useId('accordion');

  if (props.type === 'single') {
    return <SingleAccordion {...props} baseId={baseId} />;
  }
  return <MultipleAccordion {...props} baseId={baseId} />;
};

AccordionRoot.displayName = 'Accordion';

function SingleAccordion({
  value: controlledValue,
  defaultValue,
  onValueChange,
  collapsible = false,
  children,
  baseId,
}: Extract<AccordionRootProps, { type: 'single' }> & { baseId: string }) {
  const [value, setValue] = useControllableState<string | undefined>({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });

  const toggle = useCallback(
    (itemValue: string) => {
      const next = collapsible && value === itemValue ? undefined : itemValue;
      setValue(next);
    },
    [collapsible, value, setValue],
  );

  return (
    <AccordionContext.Provider value={{ isExpanded: (v) => v === value, toggle, baseId }}>
      {children}
    </AccordionContext.Provider>
  );
}

function MultipleAccordion({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  baseId,
}: Extract<AccordionRootProps, { type: 'multiple' }> & { baseId: string }) {
  const [values = [], setValues] = useControllableState<string[]>({
    value: controlledValue,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });

  const toggle = useCallback(
    (itemValue: string) => {
      const next = values.includes(itemValue)
        ? values.filter((v) => v !== itemValue)
        : [...values, itemValue];
      setValues(next);
    },
    [values, setValues],
  );

  return (
    <AccordionContext.Provider value={{ isExpanded: (v) => values.includes(v), toggle, baseId }}>
      {children}
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends ComponentPropsWithoutRef<'div'> {
  value: string;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, ...props }, ref) => {
    const { isExpanded, baseId } = useAccordionContext('Accordion.Item');
    const expanded = isExpanded(value);

    return (
      <AccordionItemContext.Provider
        value={{
          value,
          expanded,
          triggerId: `${baseId}-trigger-${value}`,
          panelId: `${baseId}-panel-${value}`,
        }}
      >
        <div ref={ref} data-state={expanded ? 'open' : 'closed'} {...props} />
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'Accordion.Item';

export type AccordionTriggerProps = ComponentPropsWithoutRef<'button'>;

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ onClick, onKeyDown, ...props }, ref) => {
    const { toggle } = useAccordionContext('Accordion.Trigger');
    const { value, expanded, triggerId, panelId } = useAccordionItemContext('Accordion.Trigger');
    const rootRef = useRef<HTMLButtonElement>(null);

    function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(e);
      const accordionEl = rootRef.current?.closest('[role="region"]')?.parentElement;
      if (!accordionEl) return;

      const triggers = Array.from(
        accordionEl.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'),
      );
      if (!rootRef.current) return;
      const idx = triggers.indexOf(rootRef.current);

      if (e.key === Keys.ArrowDown) {
        e.preventDefault();
        triggers[(idx + 1) % triggers.length]?.focus();
      } else if (e.key === Keys.ArrowUp) {
        e.preventDefault();
        triggers[(idx - 1 + triggers.length) % triggers.length]?.focus();
      } else if (e.key === Keys.Home) {
        e.preventDefault();
        triggers[0]?.focus();
      } else if (e.key === Keys.End) {
        e.preventDefault();
        triggers[triggers.length - 1]?.focus();
      }
    }

    return (
      <button
        ref={ref ?? rootRef}
        id={triggerId}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        data-state={expanded ? 'open' : 'closed'}
        data-accordion-trigger
        onClick={(e) => {
          onClick?.(e);
          toggle(value);
        }}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

AccordionTrigger.displayName = 'Accordion.Trigger';

export interface AccordionPanelProps extends ComponentPropsWithoutRef<'div'> {
  /** @default false */
  forceMount?: boolean;
}

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ forceMount = false, ...props }, ref) => {
    const { expanded, panelId, triggerId } = useAccordionItemContext('Accordion.Panel');

    if (!forceMount && !expanded) return null;

    return (
      <div
        ref={ref}
        role="region"
        id={panelId}
        aria-labelledby={triggerId}
        data-state={expanded ? 'open' : 'closed'}
        hidden={forceMount ? !expanded : undefined}
        {...props}
      />
    );
  },
);

AccordionPanel.displayName = 'Accordion.Panel';

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
});
