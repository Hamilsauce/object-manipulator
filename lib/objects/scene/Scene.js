import { SceneObject } from '../SceneObject.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { SVGViewport } from '../SVGViewport.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';

import { getSceneViewportStore, getSceneObjectsStore } from '../../../store/index.js';
import { updateSceneOrigin } from '../../../store/scene-viewport/scene-viewport.actions.js';
import { addObject, addSelectedObjects, setFocusedObject } from '../../../store/scene-objects/scene-objects.actions.js';



const { utils, template } = ham;

const { combineLatest, iif, Subject, interval, of, fromEvent, merge, from } = rxjs;
const { shareReplay, distinct, mergeAll, groupBy, sampleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter } = rxjs.operators;


export const SceneConfig = {
  scale: 16,
  width: 412,
  height: 781,
  viewBox: {
    x: -36,
    y: -64,
    width: 72,
    height: 128,
  }
};

const SceneObjectOptions = {
  type: 'rect',
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}


const sceneViewportStore = getSceneViewportStore();
const sceneObjectsStore = getSceneObjectsStore();

export class Scene extends SVGViewport {

  constructor(context, options = SceneConfig) {
    super(context, 'scene', options)

    this.origin$ = sceneViewportStore.select(state => state.origin)
    this.groupedObjectsGetter$ = sceneObjectsStore.getters.objectGroupedById

    this._objectsGetter$ = sceneObjectsStore.getters._objects.pipe(
      //.pipe(
      // distinct(o => o.id),
      map(objs => from(Object.entries(objs))),
      mergeMap(_ => _.pipe(
        filter(([id, object]) => !this.objects.has(id)),
        // tap(x => consol_e.log('STORE _OBJECTS', x)),
        // tap(([id, object]) => consol_e.log('(this.objects.has(id))', this.objects.has(id))),
        tap(([id, object]) => {
          // this.addObject(object)
        }),
        // ),
      ))
    )

    this.objectsGetter$ = sceneObjectsStore.getters.objects.pipe(
      mergeMap(_ => from(_)
        .pipe(
          distinct(o => o.id),
          filter(({ id }) => !this.objects.has(id)),
        ),
      ),
    )
    //.subscribe();

    this._objectsGetter$.subscribe()

    this.newObjects$ = this.objectsGetter$
      .pipe(
        filter(({ id }) => !this.objects.has(id)),
        tap(({ id, object }) => {
          this.addObject(object)
        }),
      ) // .subscribe();

    this.origin$.pipe(
      tap(x => console.log('[[ VIEW BOX, IN SCENE ]]: ', this.viewBox)),
      tap(_ => {
        // Object.assign(this.origin, _)
        // this.pan(_.x, _.y)
      }),
    ).subscribe()
  };

  get layers() {
    return {
      surface: this.selectDOM('#surface-layer'),
      objects: this.selectDOM('#object-layer'),
    }
  };


  init() {
    this.scene$ = combineLatest(
      this.paddleLeft.position$,
      this.paddleRight.position$,
      this.ball.position$,
      (paddleLeft, paddleRight, ball) => ({ paddleLeft, paddleRight, ball })
    ).pipe(
      sampleTime(40),
      takeWhile(() => !this.outOfBounds),
      map(({ paddleLeft, paddleRight, ball }) => {
        return { paddleLeft, paddleRight, ball }
      }),
      map(this.detectCollision.bind(this)),
    );

    this.scene$.subscribe();
  }

  createShape(type, options) {
    const newObj = this.createObject(options);

    this.objects.set(newObj.id, newObj);
    // consol_e.log('[...this.objects]', [...this.objects])

    // this.mountObject(this.objects.get(newObj.id), this.layers.objects);
  }

  addObject(type, options) {
    // consol_e.log('this', this)
    const newObj = this.createObject(type, options);

    this.objects.set(newObj.id, newObj);
    // consol_e.log('[...this.objects]', [...this.objects])
    // consol_e.log('newObj', newObj)
    this.layers.objects.append(newObj.dom)

    // console.log('new Obj DOM PARENT', newObj.dom.parentElement);
    console.log('object layer', this.layers.objects)
    // this.mountObject(this.objects.get(newObj.id), this.layers.objects);
  }
};