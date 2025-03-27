import React, {
  useState,
  useEffect,
  cloneElement,
  ReactElement,
  isValidElement,
  HTMLAttributes,
} from 'react';
import Portal from './Portal';
import { PositionType } from './types';
import {
  useFloating,
  flip,
  offset as offsetMiddleware,
  shift,
} from '@floating-ui/react-dom';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  children: React.ReactNode;
  className?: string;
  content: React.ReactElement | string;
  placement?: PositionType;
  offset?: number;
  zIndex?: number;
}

const Tooltip = ({
  children,
  content,
  placement = 'top',
  className = '',
  offset = 4,
  zIndex,
  ...props
}: TooltipProps): ReactElement => {
  const [tooltipId] = useState(
    () => `tooltip-${Math.random().toString(36).substr(2, 9)}`,
  );
  const [isOpen, setIsOpen] = useState(false);

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

  const childrenElement = isValidElement(children) ? (
    children
  ) : (
    <span>{children}</span>
  );

  const showTooltip = () => setIsOpen(true);
  const hideTooltip = () => setIsOpen(false);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') hideTooltip();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.addEventListener('keydown', handleKeyDown);
    };
  }, []);

  const childrenProps = {
    ref: (node) => {
      refs.setReference(node);
    },
    'aria-describedby': tooltipId,
    onMouseOver: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  };

  const Trigger = cloneElement(childrenElement, childrenProps);

  return (
    <>
      {Trigger}
      {isOpen && content && (
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
