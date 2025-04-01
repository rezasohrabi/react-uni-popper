import React, {
  useState,
  cloneElement,
  ReactElement,
  isValidElement,
  HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import Portal from './components/Portal';
import { PositionType, TimeoutRef } from './types';
import {
  useFloating,
  flip,
  offset as offsetMiddleware,
  shift,
} from '@floating-ui/react-dom';
import useOnEscape from './hooks/useOnEscape';
import { getId, getReactElementRef } from './utils';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  children: React.ReactNode;
  className?: string;
  content: React.ReactElement | string;
  placement?: PositionType;
  offset?: number;
  zIndex?: number;
  open?: boolean;
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Tooltip component that provides a customizable tooltip for wrapping child elements.
 * It supports controlled and uncontrolled modes, delay for opening/closing, and placement options.
 *
 * @param {React.ReactNode} children - The child element(s) that trigger the tooltip.
 * @param {React.ReactNode} content - The content to display inside the tooltip.
 * @param {string} [placement='top'] - The preferred placement of the tooltip relative to the trigger element.
 * @param {string} [className=''] - Additional CSS classes to apply to the tooltip.
 * @param {number} [offset=4] - The offset distance between the tooltip and the trigger element.
 * @param {number} [zIndex] - The z-index value for the tooltip.
 * @param {boolean} [open] - Controls the open state of the tooltip (for controlled mode).
 * @param {number} [openDelay=300] - Delay in milliseconds before the tooltip opens.
 * @param {number} [closeDelay=200] - Delay in milliseconds before the tooltip closes.
 * @param {(open: boolean) => void} [onOpenChange] - Callback triggered when the open state changes.
 * @param {object} [props] - Additional props to pass to the tooltip container.
 *
 * @returns {React.ReactElement} The Tooltip component wrapping the child element(s).
 *
 * @example
 * <Tooltip content="This is a tooltip" placement="bottom">
 *   <button>Hover me</button>
 * </Tooltip>
 */
const Tooltip = ({
  children,
  content,
  placement = 'top',
  className = '',
  offset = 4,
  zIndex,
  open,
  openDelay = 300,
  closeDelay = 200,
  onOpenChange,
  ...props
}: TooltipProps): ReactElement => {
  const [tooltipId] = useState(getId());
  const [isOpen, setIsOpen] = useState(false);
  const openTimeout = useRef<TimeoutRef>(null);
  const closeTimeout = useRef<TimeoutRef>(null);

  /**
   * Configures the floating UI element with specified placement, strategy, and middleware.
   *
   * @constant
   * @property {Object} floatingStyles - The styles to be applied to the floating element.
   * @property {Object} refs - References to the floating and reference elements.
   * @function useFloating - A hook that provides utilities for positioning floating elements.
   * @param {Object} options - Configuration options for the floating element.
   * @param {string} options.placement - The preferred placement of the floating element (e.g., 'top', 'bottom').
   * @param {string} options.strategy - The positioning strategy ('absolute' or 'fixed').
   * @param {Array} options.middleware - An array of middleware functions to modify the positioning behavior.
   * @middleware flip - Ensures the floating element stays visible by flipping its placement when necessary.
   * @middleware shift - Adjusts the floating element to remain within the viewport.
   * @middleware offsetMiddleware - Adds an offset to the floating element's position.
   * @param {Object} offsetMiddleware.options - Configuration for the offset middleware.
   * @param {number} offsetMiddleware.options.mainAxis - The offset distance along the main axis.
   */
  const { floatingStyles, refs } = useFloating({
    placement,
    strategy: 'absolute',
    middleware: [
      flip(),
      shift(),
      offsetMiddleware({
        mainAxis: offset,
      }),
    ],
  });

  /**
   * Memoized computation of the children element.
   * If the `children` prop is a valid React element, it is returned as-is.
   * Otherwise, it wraps the `children` in a `<span>` element.
   *
   * @constant
   * @type {React.ReactNode}
   * @returns {React.ReactNode} The memoized children element, either as-is or wrapped in a `<span>`.
   * @param {React.ReactNode} children - The children prop to be rendered.
   * @dependencies [children] - Recomputes only when the `children` prop changes.
   */
  const childrenElement = useMemo(
    () => (isValidElement(children) ? children : <span>{children}</span>),
    [children],
  );

  const isControlled = open !== undefined;
  const isOpenState = isControlled ? open : isOpen;

  /**
   * Closes the tooltip by updating its state and triggering the `onOpenChange` callback.
   *
   * - If the tooltip is not controlled (`isControlled` is false), it sets the `isOpen` state to `false`.
   * - Regardless of the control state, it invokes the `onOpenChange` callback with `false` if the callback is provided.
   */
  const closeTooltip = () => {
    if (!isControlled) {
      setIsOpen(false);
    }
    onOpenChange?.(false);
  };

  const openTooltip = () => {
    if (!isControlled) {
      setIsOpen(true);
    }
    onOpenChange?.(true);
  };

  /**
   * Handles the opening of the tooltip, with an optional delay.
   *
   * @param useDelay - A boolean indicating whether to apply a delay before opening the tooltip.
   *                   If `true` and `openDelay` is greater than 0, the tooltip will open after the specified delay.
   *                   If `false`, the tooltip will open immediately.
   *
   * The function clears any existing close timeout to prevent conflicts, and if a delay is specified,
   * it sets a timeout to open the tooltip after the delay. Otherwise, it opens the tooltip immediately.
   *
   * Dependencies:
   * - `isControlled`: Determines if the tooltip is controlled externally.
   * - `openDelay`: The delay duration (in milliseconds) before opening the tooltip when `useDelay` is `true`.
   */
  const handleOpen = useCallback(
    (useDelay = false) => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
      if (useDelay && openDelay > 0) {
        openTimeout.current = setTimeout(() => {
          openTooltip();
        }, openDelay);
      } else {
        openTooltip();
      }
    },
    [isControlled, openDelay],
  );

  /**
   * Handles the closing of the tooltip, with an optional delay.
   *
   * @param useDelay - A boolean indicating whether to apply a delay before closing the tooltip.
   *                   If `true` and `closeDelay` is greater than 0, the tooltip will close after the specified delay.
   *                   If `false`, the tooltip will close immediately.
   *
   * The function clears any existing open timeout to prevent conflicts, and if a delay is specified,
   * it sets a timeout to close the tooltip after the delay. Otherwise, it closes the tooltip immediately.
   *
   * Dependencies:
   * - `isControlled`: Determines if the tooltip is controlled externally.
   * - `closeDelay`: The delay duration (in milliseconds) before closing the tooltip when `useDelay` is `true`.
   */
  const handleClose = useCallback(
    (useDelay = false) => {
      if (openTimeout.current) {
        clearTimeout(openTimeout.current);
      }
      if (useDelay && closeDelay > 0) {
        closeTimeout.current = setTimeout(() => {
          closeTooltip();
        }, closeDelay);
      } else {
        closeTooltip();
      }
    },
    [isControlled, closeDelay],
  );

  useOnEscape(() => handleClose(false), isOpenState);

  useEffect(() => {
    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const childrenProps = useMemo(
    () => ({
      ref: (node) => {
        refs.setReference(node);
        const childRef = getReactElementRef(childrenElement);

        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef && 'current' in childRef) {
          childRef.current = node;
        }
      },
      'aria-describedby': tooltipId,
      onMouseOver: () => handleOpen(true),
      onMouseLeave: () => handleClose(true),
      onFocus: () => handleOpen(false), // Open immediately on focus
      onBlur: () => handleClose(false), // Close immediately on blur
      tabIndex: 0,
    }),
    [childrenElement, handleClose, handleOpen, refs, tooltipId],
  );

  const Trigger = cloneElement(childrenElement, childrenProps);

  return (
    <>
      {Trigger}
      {isOpenState && content && (
        <Portal>
          <div
            className="popper"
            ref={refs.setFloating}
            id={tooltipId}
            role="tooltip"
            style={{
              backgroundColor: 'red',
              zIndex: zIndex || 50,
              position: 'absolute',
              top: 0,
              left: 0,
              inset: '0px auto auto 0px',
              ...floatingStyles,
            }}
          >
            <div className={`headless-tooltip ${className}`} {...props}>
              {content}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Tooltip;
