export type PlacementType =
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
  placement?: PlacementType;
  offset?: number;
  arrow?: boolean;
  arrowSize?: number;
  children:
    | React.ReactNode
    | ((props: {
        placement: PlacementType;
        arrowStyles: React.CSSProperties;
        floatingStyles: React.CSSProperties;
        arrowRef: React.RefObject<HTMLDivElement>;
      }) => React.ReactNode);
};

export interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}
