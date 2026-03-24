import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Keys } from '../../utils/keyboard';
import { useControllableState } from '../../utils/use-controllable-state';
import { useId } from '../../utils/use-id';
import { useOutsideClick } from '../../utils/use-outside-click';


interface DropdownContextValue {
  open: boolean;
  triggerId: string;
  menuId: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  onOpen: () => void;
  onClose: () => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(name: string): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error(`\`${name}\` must be inside a \`<Dropdown>\`.`);
  return ctx;
}


export interface DropdownRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const DropdownRoot: FC<DropdownRootProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const triggerId = useId('dropdown-trigger');
  const menuId = useId('dropdown-menu');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useControllableState<number>({
    defaultValue: -1,
  });

  const [open = false, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [setOpen, setActiveIndex]);

  useOutsideClick(menuRef, onClose, open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: Event) {
      if ((e as globalThis.KeyboardEvent).key === Keys.Escape) onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <DropdownContext.Provider
      value={{
        open,
        triggerId,
        menuId,
        triggerRef,
        menuRef,
        onOpen,
        onClose,
        activeIndex: activeIndex ?? -1,
        setActiveIndex,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

DropdownRoot.displayName = 'Dropdown';


export type DropdownTriggerProps = ComponentPropsWithoutRef<'button'>;

export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ onClick, onKeyDown, ...props }, _ref) => {
    const { open, triggerId, menuId, triggerRef, onOpen, onClose, menuRef, setActiveIndex } =
      useDropdownContext('Dropdown.Trigger');

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(e);
      if (open) onClose();
      else onOpen();
    }

    function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(e);
      if (e.key === Keys.ArrowDown || e.key === Keys.Enter || e.key === Keys.Space) {
        e.preventDefault();
        onOpen();
        requestAnimationFrame(() => {
          const items = getMenuItems(menuRef.current);
          if (items.length > 0) {
            setActiveIndex(0);
            items[0]?.focus();
          }
        });
      }
    }

    return (
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

DropdownTrigger.displayName = 'Dropdown.Trigger';


export interface DropdownPortalProps {
  children: ReactNode;
  container?: HTMLElement | undefined;
}

export const DropdownPortal: FC<DropdownPortalProps> = ({ children, container }) => {
  const { open } = useDropdownContext('Dropdown.Portal');
  if (!open) return null;
  return createPortal(children, container ?? document.body);
};

DropdownPortal.displayName = 'Dropdown.Portal';


export type DropdownContentProps = ComponentPropsWithoutRef<'div'>;

export const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ onKeyDown, ...props }, _ref) => {
    const { menuId, triggerId, menuRef, onClose, setActiveIndex } =
      useDropdownContext('Dropdown.Content');

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(e);
      const items = getMenuItems(menuRef.current);
      const currentIndex = items.findIndex((item) => item === document.activeElement);
      // TODO: wire up RTL for horizontal sub-menus when we add them
      const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
      void dir;

      if (e.key === Keys.ArrowDown) {
        e.preventDefault();
        const next = (currentIndex + 1) % items.length;
        setActiveIndex(next);
        items[next]?.focus();
      } else if (e.key === Keys.ArrowUp) {
        e.preventDefault();
        const prev = (currentIndex - 1 + items.length) % items.length;
        setActiveIndex(prev);
        items[prev]?.focus();
      } else if (e.key === Keys.Home) {
        e.preventDefault();
        setActiveIndex(0);
        items[0]?.focus();
      } else if (e.key === Keys.End) {
        e.preventDefault();
        const last = items.length - 1;
        setActiveIndex(last);
        items[last]?.focus();
      } else if (e.key === Keys.Tab) {
        onClose();
      }
    }

    return (
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        tabIndex={-1}
        aria-labelledby={triggerId}
        data-state="open"
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

DropdownContent.displayName = 'Dropdown.Content';


export interface DropdownItemProps extends ComponentPropsWithoutRef<'div'> {
  keepOpen?: boolean;
  disabled?: boolean;
}

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ onClick, onKeyDown, keepOpen = false, disabled = false, ...props }, ref) => {
    const { onClose } = useDropdownContext('Dropdown.Item');

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
      if (disabled) return;
      onClick?.(e);
      if (!keepOpen) onClose();
    }

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(e);
      if (e.key === Keys.Enter || e.key === Keys.Space) {
        e.preventDefault();
        if (!disabled) {
          handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

DropdownItem.displayName = 'Dropdown.Item';


export type DropdownSeparatorProps = ComponentPropsWithoutRef<'div'>;

export const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  (props, ref) => <div ref={ref} role="separator" aria-orientation="horizontal" {...props} />,
);

DropdownSeparator.displayName = 'Dropdown.Separator';


export type DropdownLabelProps = ComponentPropsWithoutRef<'div'>;

export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  (props, ref) => <div ref={ref} role="group" aria-label={props['aria-label']} {...props} />,
);

DropdownLabel.displayName = 'Dropdown.Label';


function getMenuItems(menu: HTMLElement | null): HTMLElement[] {
  if (!menu) return [];
  return Array.from(
    menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'),
  );
}


export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Portal: DropdownPortal,
  Content: DropdownContent,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  Label: DropdownLabel,
});
