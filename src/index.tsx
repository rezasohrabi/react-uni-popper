import React, {
  useState,
  useRef,
  useEffect,
  cloneElement,
  ReactElement,
  isValidElement,
  HTMLAttributes,
} from "react";
import Portal from "./Portal";
import { PositionType } from "./types";
import { useOverlayPosition } from "./useOverlayPosition";

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  children: React.ReactNode;
  className?: string;
  content: React.ReactElement | string;
  position?: PositionType;
  enterDelay?: number;
  leaveDelay?: number;
  offset?: number;
  zIndex?: number;
}

const Tooltip = ({
  children,
  content,
  position = "top",
  className = "",
  offset = 16,
  zIndex,
  ...props
}: TooltipProps): ReactElement => {
  const [tooltipId] = useState(
    () => `tooltip-${Math.random().toString(36).substr(2, 9)}`,
  );
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [show, setShow] = useState(false);
  const { top, left } = useOverlayPosition({
    triggerRef,
    tooltipRef,
    position,
    show,
    offset,
  });

  const childrenElement = isValidElement(children) ? (
    children
  ) : (
    <span>{children}</span>
  );

  const showTooltip = () => {
    setShow(true);
  };

  const hideTooltip = () => {
    setShow(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") hideTooltip();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.addEventListener("keydown", handleKeyDown);
    };
  }, []);

  const childrenProps = {
    ref: (node) => {
      triggerRef.current = node;
    },
    "aria-describedby": tooltipId,
    onMouseOver: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  };

  const Trigger = cloneElement(childrenElement, childrenProps);

  return (
    <>
      {Trigger}
      {show && content && (
        <Portal>
          <div
            className="popper"
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            style={{
              backgroundColor: "red",
              zIndex: zIndex || 50,
              position: "absolute",
              top: 0,
              left: 0,
              inset: "0px auto auto 0px",
              transform: `translate3d(${left}px, ${top}px, 0px)`,
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
