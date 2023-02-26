import React, { useRef, useEffect, Ref, useCallback } from 'react';
import {
  CompPropsWithChildren,
  ContainerProps,
  JSXElementConstructorWithRef,
} from './types';
import { registerContainer, unregisterContainer } from './refManager';
import { startDnD } from './dndHandler';

export const SortableContainer =
  <Props extends Record<string, any>>(
    Component: JSXElementConstructorWithRef<Props>
  ) =>
  (
    props: CompPropsWithChildren<
      JSXElementConstructorWithRef<Props & ContainerProps>
    >
  ) => {
    const { axis, onSortEnd, helperContainer, onMouseDown, ...compProps } =
      props;
    const ref = useRef<Element>(null);
    const mouseDownHandler = useCallback(
      (event: React.MouseEvent) =>
        startDnD(event, ref, { axis, onSortEnd, helperContainer }),
      [ref, axis, onSortEnd]
    );

    useEffect(
      () => (
        registerContainer(ref, { axis, onSortEnd }),
        () => unregisterContainer(ref)
      ),
      [ref]
    );

    return (
      <Component
        ref={ref}
        onMouseDown={mouseDownHandler}
        {...(compProps as Props)}
      />
    );
  };
