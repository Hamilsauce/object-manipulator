import { domPoint } from './utils.js';
import { getSceneViewportStore } from '../store/index.js';
import { updateSceneOrigin } from '../store/scene-viewport/scene-viewport.actions.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const createPanEvent = ({ canvas, target, clientX, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : canvas), clientX, clientY);
  return domPoint(target, clientX, clientY);
};

const calculateOrigimDelta = ({ viewBox, x, y, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : canvas), clientX, clientY);
  return domPoint(target, clientX, clientY);
};


const sceneViewportStore = getSceneViewportStore()


export const addPanAction = (surfaceLayer, callback) => {
  let currentOrigin = domPoint(surfaceLayer, 0, 0)
  let panOrigin = null;

  const canvas = document.querySelector('#canvas');
  const scene = document.querySelector('#scene');
  const originMarker = document.querySelector('#origin');
  const svg = scene;
  const surface = surfaceLayer.querySelector('#surface')
  const viewBox = svg.viewBox.baseVal;

  const pointerdown$ = fromEvent(surfaceLayer, 'pointerdown')
    .pipe(
      map(createPanEvent),
      tap(point => panOrigin = point),
     
    );

  const pointermove$ = fromEvent(surfaceLayer, 'pointermove')
    .pipe(
      map(createPanEvent),
      map(({ x, y }) => {
        return {
          x: viewBox.x - ((x - panOrigin.x)),
          y: viewBox.y - ((y - panOrigin.y))
        }
      }),
    );

  const pointerup$ = fromEvent(surfaceLayer, 'pointerup')
    .pipe(map(createPanEvent));

  return pointerdown$.pipe(
    switchMap(panOrigin => pointermove$.pipe(

      tap(({ x, y }) => {
        const o = {
          x: viewBox.x + (viewBox.width / 2),
          y: viewBox.y + (viewBox.height / 2),
        }
        sceneViewportStore.dispatch(updateSceneOrigin({ x, y }))
        originMarker.setAttribute('transform', `translate(${o.x},${o.y})`)
      }),
      switchMap(delta => pointerup$)
    ))
  )
};