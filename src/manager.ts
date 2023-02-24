import { SortableElementProps } from './types';

export const registerSortable = (
  ref: React.RefObject<Element>,
  props: SortableElementProps
) => {
  sortableRefs.set(ref, props);
};

export const unregisterSortable = (ref: React.RefObject<Element>) => {
  sortableRefs.delete(ref);
};

export const registerContainer = (
  ref: React.RefObject<Element>,
  props: ContainerProps
) => {
  console.log({ ref, props });
  containerRefs.set(ref, props);
};

export const unregisterContainer = (ref: React.RefObject<Element>) => {
  console.log('>>>');
  containerRefs.delete(ref);
};

export type Axis = 'x' | 'y' | 'xy';

export type ContainerProps = {
  axis: Axis;
  onSortEnd: (p: any) => void;
};

export type Ref = React.RefObject<Element>;

const sortableRefs: Map<Ref, SortableElementProps> = new Map();
const containerRefs: Map<Ref, ContainerProps> = new Map();

const mousedownHandler = (event: MouseEvent) => {
  const { target } = event;
  if (!(target instanceof Element)) return;

  const [ref, props] = Array.from(containerRefs.entries()).find(
    ([ref, props]) => (ref.current?.contains(target) ? [ref, props] : null)
  ) ?? [null, null];
  if (!ref) return;
  event.preventDefault();
  event.stopPropagation();
  setupDnD(event, ref, props);
};

let dragContext: any = {};

const setupDnD = (event: MouseEvent, ref: Ref, props: ContainerProps) => {
  const container = ref.current;
  const dropTargets = Array.from(sortableRefs.entries()).filter(
    ([{ current }]) => container?.contains(current)
  );
  if (dropTargets.length === 0) return;
  const parent = dropTargets[0][0].current?.parentElement;
  if (
    !dropTargets.every(([{ current }]) => current?.parentElement === parent)
  ) {
    throw Error('Sortable elements must have the same parent element');
  }
  console.log({ dropTargets });
};

document.addEventListener('mousedown', mousedownHandler, { capture: true });
