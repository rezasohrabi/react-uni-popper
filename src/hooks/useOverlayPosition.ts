import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { PositionType } from '../types';

interface useOverlayPositionProps {
  triggerRef: React.RefObject<HTMLElement>;
  tooltipRef: React.RefObject<HTMLElement>;
  position: PositionType;
  show: boolean;
  offset: number;
}

export function useOverlayPosition({
  triggerRef,
  tooltipRef,
  position,
  show,
  offset,
}: useOverlayPositionProps) {
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top,
      left = 0;

    switch (position) {
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'top':
      default:
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    }

    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    if (position === 'top' && top < 0) {
      top = triggerRect.bottom + offset;
    } else if (
      position === 'bottom' &&
      top + tooltipRect.height > clientHeight
    ) {
      top = triggerRect.top - tooltipRect.height - offset;
    }

    if (position === 'left' && left < 0) {
      left = triggerRect.right + offset;
    } else if (position === 'right' && left + tooltipRect.width > clientWidth) {
      left = triggerRect.left - tooltipRect.width - offset;
    }

    if (position === 'top' || position === 'bottom') {
      if (left < 0) {
        left = 0;
      } else if (left + tooltipRect.width > clientWidth) {
        left = clientWidth - tooltipRect.width - 0;
      }
    }

    if (position === 'left' || position === 'right') {
      if (top < 0) {
        top = 0;
      } else if (top + tooltipRect.height > clientHeight) {
        top = clientHeight - tooltipRect.height - 0;
      }
    }

    top = top + window.scrollY;
    left = left + window.scrollX;

    setCoords({
      top,
      left,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  useLayoutEffect(() => {
    if (show) {
      updatePosition();
    }
  }, [show]);

  return { top: coords.top, left: coords.left };
}
