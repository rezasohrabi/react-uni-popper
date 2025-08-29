import React, { useRef, useLayoutEffect } from 'react';
import {
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  useFloating,
  arrow as arrowMiddleware,
} from '@floating-ui/react-dom';
import { ReactUniPopperProps } from './types';
import { getArrowPositionStyle } from './getArrowPositionStyle';
import { Portal } from './Portal';

export function ReactUniPopper({
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
   * Floating UI configuration with placement, strategy, and middleware.
   * @returns Floating element styles, refs, and placement data
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
       * Applies offset to floating element position.
       * When arrow is enabled, adds diagonal arrow length to offset.
       */
      offsetMiddleware(
        arrow ? offset + Math.sqrt(2 * arrowSize ** 2) / 2 : offset,
      ),
    ],
  });

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
