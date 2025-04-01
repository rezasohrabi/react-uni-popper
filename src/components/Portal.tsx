import React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

export default function Portal({ children, container }: PortalProps) {
  return createPortal(children, container || document.body);
}
