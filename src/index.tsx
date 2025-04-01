import React, {
  useState,
  cloneElement,
  ReactElement,
  isValidElement,
  HTMLAttributes,
  useCallback,
} from 'react';
import Portal from './components/Portal';
import { PositionType } from './types';
import {
  useFloating,
  flip,
  offset as offsetMiddleware,
  shift,
} from '@floating-ui/react-dom';
import useOnEscape from './hooks/useOnEscape';
import { getId } from './utils';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  children: React.ReactNode;
  className?: string;
  content: React.ReactElement | string;
  placement?: PositionType;
  offset?: number;
  zIndex?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip = ({
  children,
  content,
  placement = 'top',
  className = '',
  offset = 4,
  zIndex,
  open,
  onOpenChange,
  ...props
}: TooltipProps): ReactElement => {
  const [tooltipId] = useState(getId());
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

  const isControlled = open !== undefined;
  const isOpenState = isControlled ? open : isOpen;

  const handleClose = useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  }, [isControlled]);

  const handleOpen = useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    if (onOpenChange) {
      onOpenChange(true);
    }
  }, [isControlled]);

  useOnEscape(handleClose, isOpenState);

  const childrenProps = {
    ref: (node) => {
      refs.setReference(node);
    },
    'aria-describedby': tooltipId,
    onMouseOver: handleOpen,
    onMouseLeave: handleClose,
    onFocus: handleOpen,
    onBlur: handleClose,
    tabIndex: 0,
  };

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
