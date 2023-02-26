import { JSXElementConstructor } from 'react';

export type JSXElementConstructorWithRef<P> = JSXElementConstructor<
  P & React.RefAttributes<Element>
>;

export type CompPropsWithChildren<
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = React.PropsWithChildren<React.ComponentProps<C>>;

export type SortableElementProps = {
  index?: number;
  collection?: number | string;
  disabled?: boolean;
};

export type OnSortEnd = (update: {
  oldIndex: number;
  newIndex: number;
}) => void;

export type Axis = 'x' | 'y' | 'xy';

export type ContainerProps = {
  axis?: Axis;
  onSortEnd?: OnSortEnd;
  helperContainer?: HTMLElement | (() => HTMLElement);
};

export type ElementRef = React.RefObject<Element>;

export type DnDProps = {
  componentStyle?: React.CSSProperties;
  ghostStyle?: React.CSSProperties;
  ghostContainer?: HTMLElement;
};

export type DropTargetObjects = {
  props: SortableElementProps;
  ref: ElementRef;
  setState: (props: DnDProps) => void;
};
