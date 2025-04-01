import React from 'react';
import { createPortal } from 'react-dom';

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
export default function Portal({ children, container }: PortalProps) {
  return createPortal(children, container || document.body);
}
