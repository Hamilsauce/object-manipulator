import { domPoint } from './utils.js';
// import { getSceneViewportStore } from '../store/index.js';
// import { updateSceneOrigin } from '../store/scene-viewport/scene-viewport.actions.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { takeUntil, startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const createPanEvent = ({ context, target, clientX, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : context), clientX, clientY);
};

const calculateOrigimDelta = ({ viewBox, x, y, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : context), clientX, clientY);
};


// const sceneViewportStore = getSceneViewportStore()


export const addPanAction = (context, callback) => {
  const surfaceLayer = context.layers.surface
  let currentOrigin = domPoint(surfaceLayer, 0, 0)
  let panOrigin = null;
  
  const scene = context.dom;
  const svg = scene;
  const surface = surfaceLayer.querySelector('#surface')
  const viewBox = svg.viewBox.baseVal;
  
  const pointerdown$ = fromEvent(surface, 'pointerdown')
    .pipe(
      tap((e) => {
        // e.preventDefault();
        // e.stopPropagation();
      }),
      map(createPanEvent),
      tap(point => panOrigin = point),
    );
  
  const pointermove$ = fromEvent(document, 'pointermove')
    .pipe(
      tap(x => console.log('POINTER MOVE $')),
      tap((e) => {
        e.preventDefault();
        e.stopPropagation();
      }),
      map(createPanEvent),
      map(({ x, y }) => {
        return {
          x: viewBox.x - ((x - panOrigin.x)),
          y: viewBox.y - ((y - panOrigin.y))
        }
      }),
      tap((origin) => {
        callback(origin)
      }),
      // tap(x => console.log('PAN VIEWPORT', x)),
    );
  
  const pointerup$ = fromEvent(document, 'pointerup')
    .pipe(
      tap(x => console.warn('POINTER UP $')),

      map(createPanEvent)
      
    );
  
  // this.pointerUp$ = fromEvent(document, 'pointerup').pipe(
  //   tap(x => this.pointerTarget = null),
  // );
  
  return pointerdown$.pipe(
    switchMap(panOrigin => pointermove$.pipe(
      takeUntil(pointerup$),
      tap(({ x, y }) => {
        const o = {
          x: viewBox.x + (viewBox.width / 2),
          y: viewBox.y + (viewBox.height / 2),
        }
        // conso`le.log('x, y', x, y)
      }),
      switchMap(delta => pointerup$)
    ))
  )
};