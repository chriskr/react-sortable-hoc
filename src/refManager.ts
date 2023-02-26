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
  sortableRefs.set(ref, { props, ref, setStateWithRefCheck: getSetState(ref) });
  sortableRefsSetState.set(ref, setState);
};

export const unregisterSortable = (ref: React.RefObject<Element>) => {
  sortableRefs.delete(ref);
  sortableRefsSetState.delete(ref);
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
const sortableRefsSetState: Map<ElementRef, (props: DnDProps) => void> =
  new Map();
const containerRefs: Map<ElementRef, ContainerProps> = new Map();

const getSetState = (ref: ElementRef) => (props: DnDProps) => {
  const setState = sortableRefsSetState.get(ref);
  if (!setState) {
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
