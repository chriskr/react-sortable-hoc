import React, { useRef, useEffect } from 'react';
import { CompPropsWithChildren, JSXElementConstructorWithRef } from './types';
import {
  ContainerProps,
  registerContainer,
  unregisterContainer,
} from './manager';

export const SortableContainer =
  <Props extends Record<string, any>>(
    Component: JSXElementConstructorWithRef<Props>
  ) =>
  (
    props: CompPropsWithChildren<
      JSXElementConstructorWithRef<Props & ContainerProps>
    >
  ) => {
    const { axis, onSortEnd, ...compProps } = props;
    const ref = useRef<Element>(null);
    useEffect(
      () => (
        registerContainer(ref, { axis, onSortEnd }),
        () => unregisterContainer(ref)
      ),
      [ref]
    );
    return <Component ref={ref} {...(compProps as Props)} />;
  };
