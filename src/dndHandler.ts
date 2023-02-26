import { ContainerProps, ElementRef } from './types';
import { DnDContext, getDnDContext, getGhostStyle } from './utils';

const isNotNull = (obj: any): obj is object => obj !== null;

export const startDnD = (
  event: React.MouseEvent,
  containerRef: ElementRef,
  containerProps: ContainerProps
) => {
  const controller = new AbortController();
  const dndContext = getDnDContext(
    event,
    containerRef,
    containerProps,
    controller
  );
  if (!isNotNull(dndContext)) return;
  event.preventDefault();

  controller.signal.addEventListener('abort', () => {
    console.log('aborted');
  });
  document.addEventListener('mousemove', getMouseMoveHandler(dndContext), {
    signal: controller.signal,
  });
  document.addEventListener('mouseup', getMouseUpHandler(dndContext), {
    signal: controller.signal,
  });
};

const getMouseMoveHandler =
  (dndContext: NonNullable<DnDContext>) => (event: MouseEvent) => {
    try {
      const {
        eventStartPosition: { xStart, yStart },
      } = dndContext;
      const { clientX, clientY } = event;
      const {
        dragTarget: {
          box: { width, height, x, y },
          setState,
        },
        ghostContainer,
      } = dndContext;
      const ghostStyle = getGhostStyle({
        width,
        height,
        x,
        y,
        translateX: clientX - xStart,
        translateY: clientY - yStart,
      });
      const componentStyle: React.CSSProperties = {
        opacity: 0,
        visibility: 'hidden',
      };
      setState({ componentStyle, ghostStyle, ghostContainer });
    } catch (e) {
      dndContext.controller.abort();
    }
  };

const getMouseUpHandler =
  (dndContext: NonNullable<DnDContext>) => (event: MouseEvent) => {
    const {
      dragTarget: { setState },
    } = dndContext;
    setState({ ghostStyle: undefined, ghostContainer: undefined });
    dndContext.controller.abort();
  };