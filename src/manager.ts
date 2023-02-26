import {
  ContainerProps,
  DnDProps,
  DropTargetObjects,
  ElementRef,
  SortableElementProps,
} from './types';

export const registerSortable = (
  ref: React.RefObject<Element>,
  props: SortableElementProps,
  setState: (props: DnDProps) => void
) => {
  sortableRefs.set(ref, { props, ref, setState: getSetState(ref, setState) });
};

export const unregisterSortable = (ref: React.RefObject<Element>) => {
  sortableRefs.delete(ref);
};

export const registerContainer = (
  ref: React.RefObject<Element>,
  props: ContainerProps
) => {
  containerRefs.set(ref, props);
};

export const unregisterContainer = (ref: React.RefObject<Element>) => {
  containerRefs.delete(ref);
};

const sortableRefs: Map<ElementRef, DropTargetObjects> = new Map();
const containerRefs: Map<ElementRef, ContainerProps> = new Map();

const getSetState =
  (ref: ElementRef, setState: (props: DnDProps) => void) =>
  (props: DnDProps) => {
    if (!sortableRefs.has(ref)) {
      throw Error('Trying to set state on a dead React component');
    }
    setState(props);
  };

export const getDropTargets = (event: React.MouseEvent, ref: ElementRef) => {
  const container = ref.current;
  // TODO take collection into account?
  return Array.from(sortableRefs.values()).filter(({ ref: { current } }) =>
    container?.contains(current)
  );
};
