import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId as useReactId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Keys } from '../../utils/keyboard';



export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}


interface ComboboxContextValue {
  inputValue: string;
  setInputValue: (v: string) => void;
  selectedValue: string | null;
  setSelectedValue: (v: string | null) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  filteredOptions: ComboboxOption[];
  inputId: string;
  listboxId: string;
  getOptionId: (value: string) => string;
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLUListElement>;
  onSelect: (option: ComboboxOption) => void;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext(name: string): ComboboxContextValue {
  const ctx = useContext(ComboboxContext);
  if (!ctx) throw new Error(`\`${name}\` must be inside a \`<Combobox>\`.`);
  return ctx;
}


export interface ComboboxRootProps {
  options: ComboboxOption[];
  value?: string | null | undefined;
  onValueChange?: ((value: string | null) => void) | undefined;
  /** For async search — called on every input change. */
  onInputChange?: ((value: string) => void) | undefined;
  /** Defaults to case-insensitive label match. */
  filterFn?: ((option: ComboboxOption, inputValue: string) => boolean) | undefined;
  /** @default 300 */
  debounceMs?: number | undefined;
  children: ReactNode;
}

function defaultFilter(option: ComboboxOption, inputValue: string): boolean {
  return option.label.toLowerCase().includes(inputValue.toLowerCase());
}

export const ComboboxRoot: FC<ComboboxRootProps> = ({
  options,
  value: controlledValue,
  onValueChange,
  onInputChange,
  filterFn = defaultFilter,
  debounceMs = 300,
  children,
}) => {
  const baseId = useReactId();
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;
  const getOptionId = useCallback((v: string) => `${baseId}-option-${v}`, [baseId]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [inputValue, setInputValueRaw] = useState('');
  const [selectedValue, setSelectedValueInternal] = useState<string | null>(
    controlledValue ?? null,
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const isControlled = controlledValue !== undefined;
  const selectedVal = isControlled ? (controlledValue ?? null) : selectedValue;

  const filteredOptions = options.filter(
    (opt) => !opt.disabled && filterFn(opt, inputValue),
  );

  function setInputValue(v: string) {
    setInputValueRaw(v);
    clearTimeout(debounceTimer.current);
    if (onInputChange) {
      debounceTimer.current = setTimeout(() => onInputChange(v), debounceMs);
    }
  }

  function setSelectedValue(v: string | null) {
    if (!isControlled) setSelectedValueInternal(v);
    onValueChange?.(v);
  }

  const onSelect = useCallback(
    (option: ComboboxOption) => {
      setSelectedValue(option.value);
      setInputValueRaw(option.label);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isControlled, onValueChange],
  );

  // Keep display in sync when controlled value changes from outside
  useEffect(() => {
    if (isControlled && controlledValue) {
      const opt = options.find((o) => o.value === controlledValue);
      if (opt) setInputValueRaw(opt.label);
    }
  }, [controlledValue, isControlled, options]);

  // Close when clicking outside both the container and the portal listbox
  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  return (
    <ComboboxContext.Provider
      value={{
        inputValue,
        setInputValue,
        selectedValue: selectedVal,
        setSelectedValue,
        open,
        setOpen,
        activeIndex,
        setActiveIndex,
        filteredOptions,
        inputId,
        listboxId,
        getOptionId,
        inputRef,
        listRef,
        onSelect,
      }}
    >
      <div ref={containerRef}>{children}</div>
    </ComboboxContext.Provider>
  );
};

ComboboxRoot.displayName = 'Combobox';


export type ComboboxInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> & {
  placeholder?: string;
};

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ onKeyDown, onFocus, ...props }, _ref) => {
    const {
      inputValue,
      setInputValue,
      open,
      setOpen,
      activeIndex,
      setActiveIndex,
      filteredOptions,
      inputId,
      listboxId,
      getOptionId,
      inputRef,
      onSelect,
    } = useComboboxContext('Combobox.Input');

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setInputValue(e.target.value);
      setOpen(true);
      setActiveIndex(-1);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      onKeyDown?.(e);
      if (!open && (e.key === Keys.ArrowDown || e.key === Keys.ArrowUp)) {
        setOpen(true);
        return;
      }

      if (!open) return;

      switch (e.key) {
        case Keys.ArrowDown: {
          e.preventDefault();
          const next = activeIndex < filteredOptions.length - 1 ? activeIndex + 1 : 0;
          setActiveIndex(next);
          break;
        }
        case Keys.ArrowUp: {
          e.preventDefault();
          const prev = activeIndex > 0 ? activeIndex - 1 : filteredOptions.length - 1;
          setActiveIndex(prev);
          break;
        }
        case Keys.Enter: {
          e.preventDefault();
          const option = filteredOptions[activeIndex];
          if (option) onSelect(option);
          break;
        }
        case Keys.Escape: {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
          break;
        }
        case Keys.Home: {
          e.preventDefault();
          setActiveIndex(0);
          break;
        }
        case Keys.End: {
          e.preventDefault();
          setActiveIndex(filteredOptions.length - 1);
          break;
        }
        case Keys.Tab: {
          setOpen(false);
          break;
        }
      }
    }

    const activeOption = filteredOptions[activeIndex];

    return (
      <input
        ref={inputRef}
        id={inputId}
        role="combobox"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={activeOption ? getOptionId(activeOption.value) : undefined}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          onFocus?.(e);
        }}
        {...props}
      />
    );
  },
);

ComboboxInput.displayName = 'Combobox.Input';


export interface ComboboxPortalProps {
  children: ReactNode;
  container?: HTMLElement;
}

export const ComboboxPortal: FC<ComboboxPortalProps> = ({ children, container }) => {
  const { open } = useComboboxContext('Combobox.Portal');
  if (!open) return null;
  return createPortal(children, container ?? document.body);
};

ComboboxPortal.displayName = 'Combobox.Portal';


export type ComboboxListboxProps = ComponentPropsWithoutRef<'ul'>;

export const ComboboxListbox = forwardRef<HTMLUListElement, ComboboxListboxProps>(
  (props, _ref) => {
    const { listboxId, inputId, listRef } = useComboboxContext('Combobox.Listbox');
    return (
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={inputId}
        {...props}
      />
    );
  },
);

ComboboxListbox.displayName = 'Combobox.Listbox';


export interface ComboboxOptionItemProps extends Omit<ComponentPropsWithoutRef<'li'>, 'value'> {
  value: string;
  label: string;
  index: number;
}

export const ComboboxOptionItem = forwardRef<HTMLLIElement, ComboboxOptionItemProps>(
  ({ value, label, index: _index, onClick, onKeyDown, ...props }, ref) => {
    const { selectedValue, activeIndex, getOptionId, onSelect, filteredOptions } =
      useComboboxContext('Combobox.Option');

    const filteredIndex = filteredOptions.findIndex((o) => o.value === value);
    if (filteredIndex === -1) return null;

    const isSelected = selectedValue === value;
    const isActive = activeIndex === filteredIndex;
    const option = filteredOptions[filteredIndex];

    return (
      <li
        ref={ref}
        id={getOptionId(value)}
        role="option"
        aria-selected={isSelected}
        data-active={isActive || undefined}
        onClick={(e) => {
          onClick?.(e);
          if (option) onSelect(option);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === 'Enter' && option) onSelect(option);
        }}
        {...props}
      >
        {label}
      </li>
    );
  },
);

ComboboxOptionItem.displayName = 'Combobox.Option';


export type ComboboxEmptyProps = ComponentPropsWithoutRef<'li'>;

export const ComboboxEmpty = forwardRef<HTMLLIElement, ComboboxEmptyProps>((props, ref) => {
  const { filteredOptions } = useComboboxContext('Combobox.Empty');
  if (filteredOptions.length > 0) return null;
  return <li ref={ref} role="option" aria-selected={false} aria-disabled="true" {...props} />;
});

ComboboxEmpty.displayName = 'Combobox.Empty';


export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Portal: ComboboxPortal,
  Listbox: ComboboxListbox,
  Option: ComboboxOptionItem,
  Empty: ComboboxEmpty,
});
