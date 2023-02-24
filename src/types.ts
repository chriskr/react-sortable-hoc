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
