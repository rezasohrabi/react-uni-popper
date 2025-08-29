import { PlacementType } from './types';

/**
 * Calculates arrow positioning styles based on tooltip placement.
 * @param placement - Tooltip placement direction
 * @param arrowData - Arrow coordinates from Floating UI
 * @param arrowLen - Arrow length in pixels
 * @returns CSS styles for arrow positioning
 */
export function getArrowPositionStyle(
  placement: PlacementType,
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
