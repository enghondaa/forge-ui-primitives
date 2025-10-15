import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { createFocusTrap } from '../../utils/focus-trap';
import { Keys } from '../../utils/keyboard';
import { mergeRefs } from '../../utils/merge-refs';
import { useControllableState } from '../../utils/use-controllable-state';
import { useId } from '../../utils/use-id';

// ─── Context ─────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean;
  titleId: string;
  descriptionId: string;
  onClose: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(componentName: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(`\`${componentName}\` must be rendered inside a \`<Dialog>\`.`);
  }
  return ctx;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DialogRootProps {
  /** Whether the dialog is open. */
  open?: boolean;
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Callback fired when the dialog should close. */
  onOpenChange?: (open: boolean) => void;
  /** Whether pressing Escape closes the dialog. @default true */
  closeOnEscape?: boolean;
  /** Whether clicking the overlay closes the dialog. @default true */
  closeOnOverlayClick?: boolean;
  children: ReactNode;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export const DialogRoot: FC<DialogRootProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
}) => {
  const titleId = useId('dialog-title');
  const descriptionId = useId('dialog-desc');

  const [open = false, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const onClose = useCallback(() => setOpen(false), [setOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === Keys.Escape) onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  return (
    <DialogContext.Provider value={{ open, titleId, descriptionId, onClose }}>
      {children}
    </DialogContext.Provider>
  );
};

DialogRoot.displayName = 'Dialog';

// ─── Trigger ─────────────────────────────────────────────────────────────────

export interface DialogTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ onClick, ...props }, ref) => {
    const ctx = useDialogContext('Dialog.Trigger');

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(e);
      if (!ctx.open) {
        // The parent controls opening; we just notify via aria-haspopup
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={ctx.open}
        aria-controls={ctx.titleId}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

DialogTrigger.displayName = 'Dialog.Trigger';

// ─── Portal ───────────────────────────────────────────────────────────────────

interface DialogPortalProps {
  children: ReactNode;
  /** The DOM node to portal into. Defaults to document.body. */
  container?: HTMLElement | null;
}

/**
 * Lazy-mounts the portal content — nothing is added to the DOM until the
 * dialog is first opened. This avoids layout/style recalculations for
 * dialogs that may never be opened in a session.
 */
export const DialogPortal: FC<DialogPortalProps> = ({ children, container }) => {
  const { open } = useDialogContext('Dialog.Portal');
  if (!open) return null;
  return createPortal(children, container ?? document.body);
};

DialogPortal.displayName = 'Dialog.Portal';

// ─── Overlay ─────────────────────────────────────────────────────────────────

export interface DialogOverlayProps extends ComponentPropsWithoutRef<'div'> {}

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ onClick, ...props }, ref) => {
    const { onClose } = useDialogContext('Dialog.Overlay');

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
      onClick?.(e);
      if (e.target === e.currentTarget) onClose();
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-state="open"
        onClick={handleClick}
        {...props}
      />
    );
  },
);

DialogOverlay.displayName = 'Dialog.Overlay';

// ─── Content ─────────────────────────────────────────────────────────────────

export interface DialogContentProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to focus when dialog opens. Defaults to first focusable element. */
  initialFocus?: React.RefObject<HTMLElement>;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ initialFocus, ...props }, forwardedRef) => {
    const { titleId, descriptionId } = useDialogContext('Dialog.Content');
    const contentRef = useRef<HTMLDivElement>(null);
    const ref = mergeRefs(forwardedRef, contentRef);

    // Set up focus trap
    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;
      const cleanup = createFocusTrap(el, {
        initialFocus: initialFocus?.current,
      });
      return cleanup;
    }, [initialFocus]);

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-state="open"
        tabIndex={-1}
        {...props}
      />
    );
  },
);

DialogContent.displayName = 'Dialog.Content';

// ─── Title ────────────────────────────────────────────────────────────────────

export type DialogTitleProps = ComponentPropsWithoutRef<'h2'>;

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>((props, ref) => {
  const { titleId } = useDialogContext('Dialog.Title');
  return <h2 ref={ref} id={titleId} {...props} />;
});

DialogTitle.displayName = 'Dialog.Title';

// ─── Description ─────────────────────────────────────────────────────────────

export type DialogDescriptionProps = ComponentPropsWithoutRef<'p'>;

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  (props, ref) => {
    const { descriptionId } = useDialogContext('Dialog.Description');
    return <p ref={ref} id={descriptionId} {...props} />;
  },
);

DialogDescription.displayName = 'Dialog.Description';

// ─── Close ────────────────────────────────────────────────────────────────────

export type DialogCloseProps = ComponentPropsWithoutRef<'button'>;

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ onClick, ...props }, ref) => {
    const { onClose } = useDialogContext('Dialog.Close');

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(e);
      onClose();
    }

    return (
      <button ref={ref} type="button" aria-label="Close dialog" onClick={handleClick} {...props} />
    );
  },
);

DialogClose.displayName = 'Dialog.Close';

// ─── Compound Export ─────────────────────────────────────────────────────────

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
