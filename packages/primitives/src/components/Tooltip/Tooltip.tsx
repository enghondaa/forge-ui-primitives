import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useId } from '../../utils/use-id';


interface TooltipContextValue {
  open: boolean;
  tooltipId: string;
  triggerRef: React.RefObject<HTMLElement>;
  show: () => void;
  hide: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(name: string): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error(`\`${name}\` must be inside a \`<Tooltip>\`.`);
  return ctx;
}


export interface TooltipRootProps {
  /** @default 700 */
  delayDuration?: number;
  /** @default 300 */
  skipDelayDuration?: number;
  children: ReactNode;
}

export const TooltipRoot: FC<TooltipRootProps> = ({
  delayDuration = 700,
  skipDelayDuration = 300,
  children,
}) => {
  const tooltipId = useId('tooltip');
  const triggerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setOpen(true), delayDuration);
  }, [delayDuration]);

  const hide = useCallback(() => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), skipDelayDuration);
  }, [skipDelayDuration]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <TooltipContext.Provider value={{ open, tooltipId, triggerRef, show, hide }}>
      {children}
    </TooltipContext.Provider>
  );
};

TooltipRoot.displayName = 'Tooltip';


export interface TooltipTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, _ref) => {
    const { tooltipId, triggerRef, show, hide } = useTooltipContext('Tooltip.Trigger');

    return (
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        aria-describedby={tooltipId}
        onMouseEnter={(e) => { onMouseEnter?.(e); show(); }}
        onMouseLeave={(e) => { onMouseLeave?.(e); hide(); }}
        onFocus={(e) => { onFocus?.(e); show(); }}
        onBlur={(e) => { onBlur?.(e); hide(); }}
        {...props}
      />
    );
  },
);

TooltipTrigger.displayName = 'Tooltip.Trigger';


interface TooltipPortalProps {
  children: ReactNode;
  container?: HTMLElement;
}

export const TooltipPortal: FC<TooltipPortalProps> = ({ children, container }) => {
  const { open } = useTooltipContext('Tooltip.Portal');
  if (!open) return null;
  return createPortal(children, container ?? document.body);
};

TooltipPortal.displayName = 'Tooltip.Portal';


export type TooltipContentProps = ComponentPropsWithoutRef<'div'>;

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>((props, ref) => {
  const { tooltipId } = useTooltipContext('Tooltip.Content');

  return (
    <div
      ref={ref}
      id={tooltipId}
      role="tooltip"
      data-state="open"
      {...props}
    />
  );
});

TooltipContent.displayName = 'Tooltip.Content';


export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
});
