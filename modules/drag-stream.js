import { domPoint } from '../lib/utils.js';

const { fromEvent, delay, of } = rxjs;
const { distinctUntilChanged, takeUntil, takeWhile, switchMap, scan, map, tap, filter, } = rxjs.operators;

let panOrigin = {
  x: 0,
  y: 0
}

export const createDragEvent$ = (object, event) => {
  return of(event).pipe(
    map(({ target, clientX, clientY, type }) => {
      const p = domPoint(object.dom, clientX, clientY)

      return { type, object, x: p.x, y: p.y }
    }),
    tap(({ type, x, y, object }) => {
      if (type === 'pointerdown') {
        panOrigin = { x: object.x, y: object.y }
      }
    }),
    scan((prev, { object, type, x, y }) => {
      return { type, object, x, y, }
    }, { type: null, object: null, x: 0, y: 0 }),
  );
}


export const addDragAction = (object, callback) => {
  const target = object.dom;
  const createObjectDragEvent$ = (event) => createDragEvent$(object, event)

  const pointerdown$ = fromEvent(target, 'pointerdown')
  const pointermove$ = fromEvent(target, 'pointermove')
  const pointerup$ = fromEvent(target, 'pointerup')

  target.style.touchAction = 'none';

  const dragStart$ = pointerdown$.pipe(
    distinctUntilChanged((a, b) => a.type !== b.type),
    switchMap(createObjectDragEvent$),
    tap(callback),
  );

  const dragMove$ = pointermove$.pipe(
    switchMap(createObjectDragEvent$),
    tap(callback),
  );

  const dragEnd$ = pointerup$.pipe(
    distinctUntilChanged((a, b) => a.type === b.type),
    switchMap(createObjectDragEvent$),
    tap(({ type, x, y, object }) => {
      panOrigin = { x: object.x, y: object.y }
    }),
    tap(callback),
  );

  return dragStart$.pipe(
    switchMap(startEvent => dragMove$
      .pipe(
        map(({ object, type, x, y }) => {
          return {
            x: object.x + (x - panOrigin.x),
            y: object.y + (y - panOrigin.y),
          }
        }),
        switchMap(moveEvent => dragEnd$.pipe())
      )
    )
  )
};