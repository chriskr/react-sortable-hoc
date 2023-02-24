import React, { useRef, useEffect, JSXElementConstructor } from 'react';

const manager = new (class {
  private elementRefs: Set<React.RefObject<Element>> = new Set();

  registerRef = (ref: React.RefObject<Element>) => {
    this.elementRefs.add(ref);
  };

  unregisterRef = (ref: React.RefObject<Element>) => {
    this.elementRefs.delete(ref);
  };
  constructor() {
    document.addEventListener('mousedown', (event: MouseEvent) => {
      const { target } = event;
      if (!(target instanceof Element)) return;

      this.elementRefs.forEach(({ current }) => {
        if (!current) return;
        if (current.contains(target)) {
          console.log({ current });
        }
      });
    });
  }
})();

export const SortableElement =
  (WrappedComponent: JSXElementConstructor<React.RefAttributes<Element>>) =>
  (props: React.PropsWithChildren<React.Attributes>) => {
    const ref = useRef<Element>(null);
    useEffect(() => {
      manager.registerRef(ref);
      return () => manager.unregisterRef(ref);
    });

    return <WrappedComponent ref={ref} {...props} />;
  };
