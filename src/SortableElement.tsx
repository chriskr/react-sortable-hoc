import React, { useRef, useEffect } from 'react';
import {
  CompPropsWithChildren,
  JSXElementConstructorWithRef,
  SortableElementProps,
} from './types';
import { registerSortable, unregisterSortable } from './manager';

export const SortableElement =
  <Props extends Record<string, any>>(
    Component: JSXElementConstructorWithRef<Props>
  ) =>
  (
    props: CompPropsWithChildren<
      JSXElementConstructorWithRef<Props & SortableElementProps>
    >
  ) => {
    const ref = useRef<Element>(null);
    const { index, collection, disabled, ...compProps } = props;
    useEffect(
      () => (
        registerSortable(ref, { index, collection, disabled }),
        () => unregisterSortable(ref)
      ),
      [ref, index, collection, disabled]
    );

    return <Component ref={ref} {...(compProps as Props)} />;
  };
