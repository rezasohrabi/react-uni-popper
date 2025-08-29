/**
 * Renders children into a DOM container using React Portal.
 * @param props - Portal configuration
 * @param props.children - Content to render
 * @param props.container - Target DOM element (defaults to document.body)
 * @returns React portal element
 */

import { PortalProps } from './types';
import { createPortal } from 'react-dom';

export function Portal({ children, container }: PortalProps) {
  return createPortal(children, container || document.body);
}
