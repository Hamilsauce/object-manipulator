import { Viewport } from './Viewport.js';
import { ObjectRegistry } from '../graphics-objects/ObjectRegistry.js';
import { addPanAction } from '../lib/pan-viewport.js';


const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


const testObject1 = {
  type: 'circle',
  point: {
    x: 10,
    y: -10,
  },
  dimensions: {
    width: 16,
    height: 16,
  },
  selected: true,
  focused: false,
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const getRandomIndex = () => getRandomInt(0, ObjectRegistry.size)



export class Scene extends Viewport {
  #focusedObjectId = null;
  #sceneState$ = new BehaviorSubject({
    focusedObjectId: null,
    selectedObjectIds: [],
  });

  constructor(context, options) {
    super(context, 'scene', options);

    this.pan$ = addPanAction(this, e => {
      this.pan(e);
    });
    
    // scenePan$.pipe(
    //   startWith({ origin: { x: 0, y: 0 }, viewBox: { x: -36, y: -64, width: 72, height: 128 } }),
    //   filter(({ origin, viewBox }) => origin.x && viewBox.x && viewBox.y && origin.y),
    //   // tap(x => console.warn('[[ SCREEN PAN$ ]]: ', { x })),
    //   tap(x => Object.assign(LocalVewportState.origin, x.origin)),
    //   tap((panState) => {
    //     const viewBox = scene.viewBox.baseVal;

    //     Object.assign(viewBox, { ...panState.viewBox });

    //     originElX.textContent = `x: ${Math.trunc(panState.origin.x)}`
    //     originElY.textContent = `y: ${Math.trunc(panState.origin.y)}`
    //   }),
    // ).subscribe();

    this.pan$.subscribe();

    /*
        this.surfaceClickHandler = this.handleSurfaceClick.bind(this);
        this.objectClickHandler = this.handleObjectClick.bind(this);
        this.layers.surface.addEventListener('click', this.surfaceClickHandler)
        this.layers.objects.addEventListener('click', this.objectClickHandler)
    */

    // this.sceneState$ = new BehaviorSubject({focusedObjectId: null });

    this.objectEvents$ = new Subject().pipe(
      map(x => x.target),
      tap(this.sceneState$),
    );


    fromEvent(this.dom, 'objectevent').pipe(
      tap(x => console.warn('SVGScene [[[ OBJECT EVENT ]]]: ', x)),
      tap(this.objectEvents$),
      tap((e) => {
        const { object, objectId, target } = e
        const targetObject = this.domObjectMap.get(target);
        targetObject.focus()
      }),
    ).subscribe()

    // fromEvent(this.layers.surface, 'click').pipe(
    //   tap(x => console.log('SCENE [[[SURFACE]]] EVENTS', x)),
    //   tap(this.surfaceClickHandler),
    // ) //.subscribe()

    this.#sceneState$.pipe(
      tap(x => console.log('SCENE STATE$', x))
    ).subscribe()

    window._scene = this;
  }


  get focusedObject() {
    return this.objects.get(this.#focusedObjectId);
  }


  get originMarker() {
    // return {

    // }
    return this.querySelector('#origin');
  }

  pan({ x, y }) {
    Object.assign(this.viewBox, { x, y });
    // const [textX, textY] = [...this.originMarker.querySelectorAll('.coord-text')];
    const coordTextEl = this.originMarker.querySelector('.coord-text');
    // coordTextEl.textContent = `x: ${Math.trunc(this.origin.x || 0)}, y: ${Math.trunc(this.origin.y || 0)}`;
    coordTextEl.textContent = `${Math.trunc(this.origin.x || 0)},     ${Math.trunc(this.origin.y || 0)}`;
    // textX.textContent = Math.trunc(this.origin.x || 0)
    // textY.textContent = Math.trunc(this.origin.y || 0)
    // console.log(this.origin);
    this.originMarker.setAttribute('transform', `translate(${x + (this.viewBox.width / 2)},${y + (this.viewBox.height / 2)}) scale(0.16)`);
  }

  handleSurfaceClick(e) {
    console.warn('SURFACE click');

    const newObject = { ...testObject1, type: ObjectRegistry.keys[getRandomIndex()] }

    this.insertObject(newObject.type, {
      ...newObject
    });
  }

  handleObjectClick(e) {
    const targ = e.target

    const targetObj = e.target.closest('.object-container');

    const surface = e.target.closest('#surface');

    if (surface) {
      return
    }

    if (targetObj && targetObj.id !== this.#focusedObjectId) {
      if (this.focusedObject) {
        this.focusedObject.focus(false);
      }

      this.#focusedObjectId = targetObj.id;

      this.focusedObject.focus(true);
    }

    else if (targetObj.id === this.#focusedObjectId) {
      this.focusedObject.focus();

      this.#focusedObjectId = null;
    }
  }
}