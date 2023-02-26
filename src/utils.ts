import { getDropTargets } from './manager';
import {
  ContainerProps,
  DnDProps,
  DropTargetObjects,
  ElementRef,
  SortableElementProps,
} from './types';

export const getDnDContext = (
  event: React.MouseEvent,
  containerRef: ElementRef,
  containerProps: ContainerProps,
  controller: AbortController
) => {
  const dropTargets = getDropTargets(event, containerRef);
  if (dropTargets.length === 0) return null;
  if (!checkDropTargetsParent(dropTargets)) {
    throw Error('All sortable elements must have the same parent element');
  }
  const dragTarget = dropTargets.find(({ ref: { current } }) =>
    current?.contains(event.target as Node)
  );

  if (!dragTarget) return null;
  const { dropTargetsObjects, parentBox } = getDropTargetsObjects(
    dropTargets,
    dragTarget
  );
  const dragTragetObject = dropTargetsObjects.find(
    ({ isDragTraget }) => isDragTraget
  )!;
  if (!parentBox) {
    return null;
  }
  const rowAndColumnCount = getRowsAndColumnsCount(dropTargetsObjects);
  // Assumption is that we have a consitent horizontal and vertical spacing
  // between items and consitent horizontal and vertical spacing to the
  // container.
  const deltas = getDeltas(parentBox, dropTargetsObjects, rowAndColumnCount);
  const ghostContainer = getGhostContainer(containerProps.helperContainer);
  console.log({ ghostContainer });
  return {
    eventStartPosition: {
      xStart: event.clientX,
      yStart: event.clientY,
    },
    containerRef,
    containerProps,
    dropTargets: dropTargetsObjects,
    dragTarget: dragTragetObject,
    parentBox,
    controller,
    isActive: false,
    ...rowAndColumnCount,
    ...deltas,
    availableWidth: parentBox.width - 2 * deltas.parentDeltaX,
    availableHeight: parentBox.height - 2 * deltas.parentDeltaY,
    ghostContainer,
  };
};

export type DnDContext = ReturnType<typeof getDnDContext>;

const checkDropTargetsParent = (dropTargets: DropTargetObjects[]) => {
  if (dropTargets.length === 0) return false;
  const parent = dropTargets[0].ref.current?.parentElement;
  if (!parent) return false;
  return dropTargets.every(
    ({ ref: { current } }) => current?.parentElement === parent
  );
};

const getDropTargetsObjects = (
  dropTargets: DropTargetObjects[],
  dragTarget: DropTargetObjects
) => {
  if (dropTargets.length === 0) {
    return { dropTargetsObjects: [] as DropTarget[], parentBox: null };
  }
  const parent = dropTargets[0].ref.current?.parentElement;
  if (!isHTMLElement(parent))
    return { dropTargetsObjects: [] as DropTarget[], parentBox: null };
  const parentBox = parent.getBoundingClientRect() ?? {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const childrenIndexMap = new Map(
    Array.from(parent.children).map((child, index) => [child, index])
  );
  const { ref: dragTragetRef } = dragTarget;
  const dropTargetObjects = dropTargets.map(({ ref, props, setState }) => {
    const index = childrenIndexMap.get(ref.current as Element) ?? -1;
    return {
      props,
      ref,
      setState,
      box: ref.current?.getBoundingClientRect() ?? {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      initialIndex: index,
      currentIndex: index,
      isDragTraget: ref === dragTragetRef,
      translateX: 0,
      translateY: 0,
      relativeX: 0,
      relativeY: 0,
    };
  });
  if (
    dropTargetObjects.some(
      ({ initialIndex, box }) => initialIndex === -1 || !box
    )
  ) {
    return { dropTargetsObjects: [] as DropTarget[], parentBox: null };
  }
  const dropTargetObjectsSorted = dropTargetObjects.sort(
    ({ initialIndex: index1 }, { initialIndex: index2 }) => index1 - index2
  );
  const {
    box: { x: relativeStartX, y: relativeStartY },
  } = dropTargetObjectsSorted[0];

  dropTargetObjectsSorted.forEach((dropTarget) => {
    dropTarget.relativeX = dropTarget.box.x - relativeStartX;
    dropTarget.relativeY = dropTarget.box.y - relativeStartY;
  });

  return {
    dropTargetsObjects: dropTargetObjectsSorted as DropTarget[],
    parentBox,
  };
};

type DropTarget = {
  props: SortableElementProps;
  ref: ElementRef;
  box: DOMRect;
  initialIndex: number;
  currentIndex: number;
  isDragTraget: boolean;
  translateX: number;
  translateY: number;
  relativeX: number;
  relativeY: number;
  setState: (props: DnDProps) => void;
};

const getRowsAndColumnsCount = (dropTragets: DropTarget[]) => {
  const columnStart = new Set<number>();
  const rowStart = new Set<number>();
  dropTragets.forEach(({ box: { x, y } }) => {
    columnStart.add(x);
    rowStart.add(y);
  });
  return { columnCount: columnStart.size, rowCount: rowStart.size };
};

const getDeltas = (
  parentBox: DOMRect,
  dropTargets: DropTarget[],
  { columnCount, rowCount }: { columnCount: number; rowCount: number }
) => {
  if (dropTargets.length === 0) {
    return { parentDeltaX: 0, parentDeltaY: 0, deltaX: 0, deltaY: 0 };
  }
  const { box: box0 } = dropTargets[0];
  const parentDeltaX = box0.x - parentBox.x;
  const parentDeltaY = box0.y - parentBox.y;
  if (dropTargets.length === 1) {
    return {
      parentDeltaX,
      parentDeltaY,
      deltaX: 0,
      deltaY: 0,
    };
  }
  const { box: box1 } = dropTargets[1];
  const deltaX = columnCount > 1 ? box1.x - (box0.x + box0.width) : 0;
  const { box: nextRowBox } =
    dropTargets.find(({ box }) => box.y > box0.y) ?? {};
  const deltaY =
    nextRowBox && rowCount > 1 ? nextRowBox.y - (box0.y + box0.height) : 0;
  return { parentDeltaX, parentDeltaY, deltaX, deltaY };
};

const getGhostContainer = (
  helperContainer?: HTMLElement | (() => HTMLElement)
) => {
  if (helperContainer instanceof HTMLElement) return helperContainer;
  return (
    (typeof helperContainer === 'function' && helperContainer()) ||
    document.body
  );
};
export const getGhostStyle = ({
  width,
  height,
  x,
  y,
  translateX,
  translateY,
}: {
  width: number;
  height: number;
  x: number;
  y: number;
  translateX: number;
  translateY: number;
}): React.CSSProperties => ({
  boxSizing: 'border-box',
  width: `${width}px`,
  height: `${height}px`,
  position: 'fixed',
  top: `${y}px`,
  left: `${x}px`,
  zIndex: '10000',
  margin: 0,
  transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
});

const isHTMLElement = (node: any): node is HTMLElement =>
  node instanceof HTMLElement;

export const setTranslate = (element: HTMLElement, x: number, y: number) => {
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};
