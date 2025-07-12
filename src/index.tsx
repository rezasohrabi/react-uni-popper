import React, { useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  useFloating,
  arrow as arrowMiddleware,
} from '@floating-ui/react-dom';
interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

/**
 * A React component that renders its children into a specified DOM container
 * using React's `createPortal` function. If no container is provided, it defaults
 * to rendering into the `document.body`.
 *
 * @param {PortalProps} props - The props for the Portal component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the portal.
 * @param {HTMLElement} [props.container] - The DOM element where the portal content
 * will be rendered. Defaults to `document.body` if not provided.
 *
 * @returns {React.ReactPortal} A React portal that renders the children into the specified container.
 */
function Portal({ children, container }: PortalProps) {
  return createPortal(children, container || document.body);
}

export type PositionType =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';

export type ReactUniPopperProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  portalContainer?: HTMLElement;
  reference: HTMLElement | null;
  zIndex?: number;
  placement?: PositionType;
  offset?: number;
  arrow?: boolean;
  arrowSize?: number;
  children:
    | React.ReactNode
    | ((props: {
        placement: PositionType;
        arrowStyles: React.CSSProperties;
        floatingStyles: React.CSSProperties;
        arrowRef: React.RefObject<HTMLDivElement>;
      }) => React.ReactNode);
};

function ReactUniPopper({
  portalContainer,
  reference,
  children,
  placement = 'bottom',
  offset = 4,
  zIndex,
  arrow,
  arrowSize,
  ...props
}: ReactUniPopperProps) {
  const arrowRef = useRef<HTMLDivElement | null>(null);

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
  const {
    floatingStyles,
    refs,
    middlewareData,
    placement: finalPlacement,
  } = useFloating({
    placement,
    strategy: 'absolute',
    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      shift(),
      arrow ? arrowMiddleware({ element: arrowRef }) : undefined,
      /**
       * Applies an offset to the floating element's position.
       * When arrow is enabled, the offset is calculated using the formula:
       * offset + (√(2 * arrowSize²) / 2)
       * This formula accounts for the arrow's diagonal length when rotated 45°,
       * ensuring proper spacing between the tooltip and its target.
       * When arrow is disabled, uses the base offset value.
       */
      offsetMiddleware(
        arrow ? offset + Math.sqrt(2 * arrowSize ** 2) / 2 : offset,
      ),
    ],
  });
  /**
   * Calculates the CSS positioning styles for the tooltip arrow based on its placement.
   *
   * The arrow is positioned using a combination of absolute positioning and negative margins:
   * - For x/y positioning, uses the coordinates provided by Floating UI's arrow middleware
   * - For the side opposite to the tooltip placement, uses a negative margin of -arrowLen/2
   *   This creates the effect of the arrow protruding from the tooltip by half its length
   *
   * @param {PositionType} placement - The tooltip placement (e.g. 'top', 'bottom-start', etc)
   * @param {Object} arrowData - Arrow position data from Floating UI
   * @param {number} [arrowData.x] - X coordinate for arrow positioning
   * @param {number} [arrowData.y] - Y coordinate for arrow positioning
   * @param {number} arrowLen - Length of the arrow in pixels
   * @returns {React.CSSProperties} CSS styles object for arrow positioning
   *
   * @example
   * // For a top placement with arrowLen = 12:
   * // Returns styles that position arrow at bottom of tooltip
   * // with negative margin of -6px (half the arrow length)
   * getArrowPositionStyle('top', {x: 100, y: 50}, 12)
   * // => { left: '100px', top: '50px', bottom: '-6px' }
   */
  function getArrowPositionStyle(
    placement: PositionType,
    arrowData: { x?: number; y?: number } = {},
    arrowLen: number,
  ): React.CSSProperties {
    const side = placement.split('-')[0];
    const staticSideMap = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    };

    const style: React.CSSProperties = {
      left: arrowData.x != null ? `${arrowData.x}px` : '',
      top: arrowData.y != null ? `${arrowData.y}px` : '',
      right: '',
      bottom: '',
      [staticSideMap[side]]: `${-arrowLen / 2}px`,
    };

    return style;
  }

  useLayoutEffect(() => {
    if (reference) {
      refs.setReference(reference);
    }
  }, [reference, refs]);

  return (
    <Portal container={portalContainer}>
      <div
        className="headless-popper"
        ref={refs.setFloating}
        style={{
          zIndex: zIndex,
          position: 'absolute',
          top: 0,
          left: 0,
          ...floatingStyles,
        }}
        {...props}
      >
        {typeof children === 'function'
          ? children({
              placement: finalPlacement,
              arrowRef: arrowRef,
              floatingStyles,
              arrowStyles: getArrowPositionStyle(
                finalPlacement,
                middlewareData.arrow,
                arrowSize,
              ),
            })
          : children}
      </div>
    </Portal>
  );
}

export default ReactUniPopper;
