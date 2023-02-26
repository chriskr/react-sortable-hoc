import React, { useRef, useEffect, useState } from 'react';
import {
  CompPropsWithChildren,
  DnDProps,
  JSXElementConstructorWithRef,
  SortableElementProps,
} from './types';
import { registerSortable, unregisterSortable } from './manager';
import ReactDOM from 'react-dom';

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
    const [{ componentStyle, ghostStyle, ghostContainer }, setState] =
      useState<DnDProps>({});
    const { index, collection, disabled, style, ...compProps } = props;
    const mergedStyle =
      style && componentStyle
        ? { ...style, ...componentStyle }
        : style || componentStyle || null;
    const mergedGhostStyle = ghostStyle
      ? { ...(style || {}), ...ghostStyle }
      : null;
    useEffect(
      () => (
        registerSortable(ref, { index, collection, disabled }, setState),
        () => unregisterSortable(ref)
      ),
      [ref, index, collection, disabled, setState]
    );

    return (
      <>
        <Component ref={ref} {...(compProps as Props)} style={mergedStyle} />
        {ghostContainer &&
          ghostStyle &&
          ReactDOM.createPortal(
            <div>
              <Component {...(compProps as Props)} style={mergedGhostStyle}>
                {(compProps as Props).children}
              </Component>
            </div>,
            ghostContainer
          )}
      </>
    );
  };
